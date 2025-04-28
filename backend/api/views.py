from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from locations.views import LocationView
from weather.views import WeatherView
from food.views import FoodView
from flights.views import FlightView

class CombinedDataView(APIView):
    def get(self, request):
        result = {}

        # 1. Получаем локацию
        location_view = LocationView()
        location_response = location_view.get(request)
        result["location"] = location_response.data

        location_data = location_response.data.get("results", [])
        if not location_data:
            return Response({"error": "Город не найден"}, status=status.HTTP_404_NOT_FOUND)

        latitude = location_data[0]["latitude"]
        longitude = location_data[0]["longitude"]
        clean_city_name = location_data[0]["name"].split(",")[0].strip()

        # 2. Подменяем параметры для FoodView
        food_request = request._request.GET.copy()
        food_request["latitude"] = latitude
        food_request["longitude"] = longitude
        request._request.GET = food_request

        food_view = FoodView()
        food_response = food_view.get(request)
        result["restaurants"] = food_response.data

        # 3. Подменяем параметры для FlightView
        flight_request = request._request.GET.copy()
        flight_request["destination"] = clean_city_name  # <-- ПЕРЕПИСЫВАЕМ destination на правильный город
        request._request.GET = flight_request

        flight_view = FlightView()
        flight_response = flight_view.get(request)
        result["flights"] = flight_response.data

        # 4. Погода можно оставить как есть
        weather_view = WeatherView()
        weather_response = weather_view.get(request)
        result["weather"] = weather_response.data

        return Response(result, status=status.HTTP_200_OK)

