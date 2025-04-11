from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from locations.views import LocationView
from weather.views import WeatherView
from food.views import FoodView
from flights.views import FlightView

class CombinedDataView(APIView):
    def get(self, request):
        place = request.GET.get("place", "")
        origin = request.GET.get("origin", "")

        result = {}

        location_view = LocationView()
        location_response = location_view.get(request)
        result["location"] = location_response.data  # Извлекаем данные из Response

        # Погода: передаем city в WeatherView
        weather_view = WeatherView()
        weather_response = weather_view.get(request)
        result["weather"] = weather_response.data  # Извлекаем данные из Response

        # Рестораны: передаем place в FoodView
        food_view = FoodView()
        food_response = food_view.get(request)
        result["restaurants"] = food_response.data  # Извлекаем данные из Response

        # Авиарейсы: передаем origin в FlightView
        flight_view = FlightView()
        flight_response = flight_view.get(request)
        result["flights"] = flight_response.data  # Извлекаем данные из Response

        return Response(result, status=status.HTTP_200_OK)
