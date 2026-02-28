from django.urls import path

from .views import GetPoisFromLocation

urlpatterns = [path('pois/', GetPoisFromLocation.as_view())]
