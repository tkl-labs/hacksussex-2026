# Create your views here.
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView


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

        return Response({"pois": (lat, lng, rad)})
