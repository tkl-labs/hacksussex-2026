# Create your views here.
import os

import requests
from django.http import StreamingHttpResponse
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')
session = requests.session()


class TtsSerializer(serializers.Serializer):
    text = serializers.CharField()


class GenerateMp3FromText(APIView):
    def get(self, request):
        text = request.query_params.get("text", "")
        if not text:
            return Response({"error": "text is required"}, status=400)

        url = "https://api.elevenlabs.io/v1/text-to-speech/qBDvhofpxp92JgXJxDjB"
        headers = {"xi-api-key": ELEVENLABS_API_KEY, "output_format": "mp3_44100_128"}
        payload = {"text": text, "model_id": "eleven_flash_v2_5"}

        response = session.post(url, headers=headers, json=payload, stream=True, timeout=(5, 60))

        if response.status_code == 200:
            return StreamingHttpResponse(response.iter_content(chunk_size=8192), content_type="audio/mpeg")
        else:
            return Response({"error": response.text}, status=response.status_code)