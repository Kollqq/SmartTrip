from django.urls import path, include
from .views import CombinedDataView

urlpatterns = [
    path("locations/", include("locations.urls")),
    path("flights/", include("flights.urls")),
    path("weather/", include("weather.urls")),
    path("food/", include("food.urls")),
    path("combined/", CombinedDataView.as_view(), name="combined-data"),
]
