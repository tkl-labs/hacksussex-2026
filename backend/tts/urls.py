from django.urls import path

from .views import GenerateMp3FromText

urlpatterns = [path('gen/', GenerateMp3FromText.as_view())]
