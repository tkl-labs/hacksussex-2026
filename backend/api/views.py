# Create your views here.
import os

import requests
from dotenv import load_dotenv
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")


class LocationSerializer(serializers.Serializer):
    lat = serializers.FloatField(min_value=-90, max_value=90)
    lng = serializers.FloatField(min_value=-180, max_value=180)
    rad = serializers.FloatField(min_value=0, max_value=100)


class GetPoisFromLocation(APIView):
    def get(self, request):
        serializer = LocationSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        lat = serializer.validated_data['lat']
        lng = serializer.validated_data['lng']
        rad = serializer.validated_data['rad']

        url = "https://places.googleapis.com/v1/places:searchText"

        headers = {"Content-Type": "application/json", "X-Goog-Api-Key": GOOGLE_API_KEY,
            "X-Goog-FieldMask": "*"}

        data = {"textQuery": "restaurants in Brighton, England", "maxResultCount": 5}

        response = requests.post(url, headers=headers, json=data)

        if response.status_code == 200:
            print(response.json())
            return Response({"pois": (lat, lng, rad), "google_response": response.json()})
        else:
            print(f"Error {response.status_code}: {response.text}")
            return Response({"pois": (lat, lng, rad)})
