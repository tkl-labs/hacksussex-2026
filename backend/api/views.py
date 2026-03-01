# Create your views here.
import math
import os

import requests
from google import genai
from google.genai.types import GenerateContentConfig
from pydantic import BaseModel
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

PLACES_API_KEY = os.getenv('PLACES_API_KEY')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

session = requests.session()
genai_client = genai.Client(api_key=GEMINI_API_KEY)


def get_primary_types() -> list[str]:
    with open('./primary_types.txt') as f:
        return f.read().splitlines()


PRIMARY_TYPES = get_primary_types()


class LocationSerializer(serializers.Serializer):
    lat = serializers.FloatField(min_value=-90, max_value=90)
    lng = serializers.FloatField(min_value=-180, max_value=180)
    rad = serializers.FloatField(min_value=0, max_value=1000)


class NameSerializer(serializers.Serializer):
    name = (serializers.ListField(child=serializers.CharField(), min_length=5, max_length=5))


class PlaceDescription(BaseModel):
    name: str
    desc: str


class JsonOutput(BaseModel):
    places: list[PlaceDescription]


class Card:
    def __init__(self, places_response):
        self.name = places_response['displayName']
        self.distance = places_response['distance']
        self.rating = places_response['rating']
        self.review_count = places_response['userRatingCount']


def flatten(places_response):
    if len(places_response) > 0:
        for entry in places_response['places']:
            text = entry['displayName']['text']
            entry['displayName'] = text
    return places_response


def rank_poi(places_response):
    rating = places_response.get('rating', 0)
    user_rating_count = max(places_response.get('userRatingCount', 0), 1)
    distance = places_response['distance']

    '''
    Rank a point of interest using:
    - rating (0–5)
    - number of reviews
    - distance in km
    '''

    # stabilize rating (Bayesian smoothing)
    # prevents 5.0 with 2 reviews from dominating
    m = 50  # review smoothing threshold
    C = 4.0  # assumed global average rating
    weighted_rating = ((user_rating_count / (user_rating_count + m)) * rating + (m / (user_rating_count + m)) * C)

    # popularity boost (log scale)
    popularity = math.log1p(user_rating_count)

    # distance decay
    k = 1.2  # higher = distance matters more
    distance_weight = math.exp(-k * distance)

    # final score
    return weighted_rating * popularity * distance_weight


def get_distance(cord1, cord2) -> float:
    r = 6371.0

    lat1 = math.radians(cord1['latitude'])
    lon1 = math.radians(cord1['longitude'])

    lat2 = math.radians(cord2['latitude'])
    lon2 = math.radians(cord2['longitude'])

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return r * c


class GetPoisFromLocation(APIView):
    def post(self, request):
        serializer = LocationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        lat = serializer.validated_data['lat']
        lng = serializer.validated_data['lng']
        rad = serializer.validated_data['rad']

        url = 'https://places.googleapis.com/v1/places:searchNearby'

        headers = {'Content-Type': 'application/json', 'X-Goog-Api-Key': PLACES_API_KEY,
                   'X-Goog-FieldMask': 'places.displayName.text,places.location.latitude,places.location.longitude,places.userRatingCount,places.rating'}

        payload = {'locationRestriction': {'circle': {'center': {'latitude': lat, 'longitude': lng}, 'radius': rad}},
                   'includedPrimaryTypes': PRIMARY_TYPES, 'maxResultCount': 5}

        response = session.post(url, headers=headers, json=payload, timeout=(5, 60))

        if response.status_code != 200:
            print(f'Error {response.status_code}: {response.text}')
            return Response({response.status_code: response.text})

        results = flatten(response.json())

        if 'places' not in results:
            return Response([])

        results = results['places']

        temp = []
        for result in results:
            location = result['location']
            del result['location']

            flat = {**result, **location}
            temp.append(flat)
        results = temp

        coord1 = {'latitude': lat, 'longitude': lng}

        cards = []
        for result in results:
            coord2 = {'latitude': result['latitude'], 'longitude': result['longitude'], }

            del result['latitude']
            del result['longitude']

            distance = get_distance(coord1, coord2)
            result['distance'] = distance
            cards.append(result)

        ranked = sorted(results, key=rank_poi, reverse=True)

        return Response(ranked)


class GetDescriptionFromName(APIView):
    def post(self, request):
        serializer = NameSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        names = serializer.validated_data['name']

        prompt = f'''
        Describe each of the following places for a walking tour app.
        Write ~75 words per place.
        Be factual. No speculation.
        
        Return JSON in this format:
        {{
          "places": [
            {{
              "name": "Place name",
              "desc": "Description"
            }}
          ]
        }}

        Places:
        {chr(10).join(names)}
        '''

        response = genai_client.models.generate_content(model='gemini-3-flash-preview', contents=prompt,
                                                        config=GenerateContentConfig(
                                                            response_mime_type='application/json',
                                                            response_schema=JsonOutput), )
        return Response(response.parsed.model_dump())
