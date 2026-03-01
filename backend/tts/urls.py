from django.urls import path

from .views import GenerateMp3FromText

urlpatterns = [path('tts/', GenerateMp3FromText.as_view())]
