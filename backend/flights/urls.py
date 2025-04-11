from django.urls import path
from .views import FlightView

urlpatterns = [
    path("", FlightView.as_view(), name="flight-info"),
]
