from django.urls import path

from .views import GetPoisFromLocation, GetDescriptionFromName

urlpatterns = [path('pois/', GetPoisFromLocation.as_view()), path('desc/', GetDescriptionFromName.as_view())]
