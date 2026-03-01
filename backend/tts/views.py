# Create your views here.
import os

import requests
from django.http import HttpResponse
from dotenv import load_dotenv
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

load_dotenv()
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")


class TtsSerializer(serializers.Serializer):
    text = serializers.CharField()


class GenerateMp3FromText(APIView):
    def post(self, request):
        serializer = TtsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        text = serializer.validated_data['text']

        url = "https://api.elevenlabs.io/v1/text-to-speech/qBDvhofpxp92JgXJxDjB"

        headers = {"xi-api-key": ELEVENLABS_API_KEY, "output_format": "mp3_44100_128"}

        data = {"text": text, "model_id": "eleven_flash_v2_5"}

        response = requests.post(url, headers=headers, json=data)

        if response.status_code == 200:
            return HttpResponse(response.content, content_type="audio/mpeg")
        else:
            return Response({"error": response.text}, status=response.status_code)
