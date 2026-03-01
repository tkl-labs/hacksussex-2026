# Create your views here.
import os

import math
import requests
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
session = requests.session()


def get_primary_types() -> list[str]:
    f = open("./primary_types.txt", "r")
    content = f.read()
    f.close()
    types = content.splitlines()
    return types


PRIMARY_TYPES: list[str] = get_primary_types()


def flatten(places_response):
    if len(places_response) > 0:
        for entry in places_response['places']:
            text = entry["displayName"]["text"]
            entry["displayName"] = text
    return places_response


class LocationSerializer(serializers.Serializer):
    lat = serializers.FloatField(min_value=-90, max_value=90)
    lng = serializers.FloatField(min_value=-180, max_value=180)
    rad = serializers.FloatField(min_value=0, max_value=1000)



def rank_poi(map):
    rating = map["rating"]
    userRatingCount = map["userRatingCount"]
    distance = map["distance"]


    """
    Rank a point of interest using:
    - rating (0–5)
    - number of reviews
    - distance in km
    """

    # --- 1️⃣ Stabilize rating (Bayesian smoothing)
    # prevents 5.0 with 2 reviews from dominating
    m = 50              # review smoothing threshold
    C = 4.0             # assumed global average rating

    weighted_rating = (
        (userRatingCount / (userRatingCount + m)) * rating
        + (m / (userRatingCount + m)) * C
    )

    # --- 2️⃣ Popularity boost (log scale)
    popularity = math.log1p(userRatingCount)

    # --- 3️⃣ Distance decay
    k = 1.2             # higher = distance matters more
    distance_weight = math.exp(-k * distance)

    # --- 4️⃣ Final score
    return weighted_rating * popularity * distance_weight



def get_distance(cord1, cord2) -> float:
    R = 6371.0

    lat1 = cord1["latitude"]
    lon1 = cord1["longitude"]

    lat2 = cord2["latitude"]
    lon2 = cord2["longitude"]


    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = math.sin(dlat / 2)**2 + \
        math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c

    return distance


class Card:
    def __init__(self, map):
        self.name = map["displayName"]
        self.distance = map["distance"]
        self.rating = map["rating"]
        self.review_count = map["userRatingCount"]

class GetPoisFromLocation(APIView):
    def post(self, request):
        serializer = LocationSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        lat = serializer.validated_data['lat']
        lng = serializer.validated_data['lng']
        rad = serializer.validated_data['rad']

        url = "https://places.googleapis.com/v1/places:searchNearby"

        headers = { "Content-Type": "application/json", "X-Goog-Api-Key": GOOGLE_API_KEY, "X-Goog-FieldMask": "places.displayName.text,places.formattedAddress" }

        data = {
            "locationRestriction":
            { "circle": {
                "center": {
                    "latitude": lat,
                    "longitude": lng
                },
                "radius": rad
            }},
            "includedPrimaryTypes": PRIMARY_TYPES,
            "maxResultCount": 5
        }
        headers = { "Content-Type": "application/json", "X-Goog-Api-Key": GOOGLE_API_KEY, "X-Goog-FieldMask":
                   "places.displayName.text,places.location.latitude,places.location.longitude,places.userRatingCount,places.rating"}
        data = {
            "locationRestriction":
            { "circle": {
                "center": {
                    "latitude": lat,
                    "longitude": lng
                },
                "radius": rad
            }},
            "includedPrimaryTypes": PRIMARY_TYPES,
            "maxResultCount": 5
        }

        response = requests.post(url, headers=headers, json=data)

        if response.status_code != 200:
            print(f"Error {response.status_code}: {response.text}")
            return Response({response.status_code: response.text})


        results = flatten(response.json())

        if "places" not in results:
            return Response([])

        results = results["places"]


        temp = []
        for result in results:
            location = result["location"]
            del result["location"]

            flat = {**result, **location}
            temp.append(flat)
        results = temp

        print(results)

        cord1 = {
            "latitude": lat,
            "longitude": lng
        }

        cards = []

        for result in results:
            cord2 = {
                "latitude": result["latitude"],
                "longitude": result["longitude"],
            }

            del result["latitude"]
            del result["longitude"]

            distance = get_distance(cord1, cord2)
            result["distance"] = distance
            cards.append(result)


        ranked =sorted(results, key=rank_poi, reverse=True)


        print(ranked)
        return Response(ranked)






