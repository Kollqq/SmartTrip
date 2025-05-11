from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from locations.views import LocationView
from weather.views import WeatherView
from food.views import FoodView
from flights.views import FlightView
from django.test import RequestFactory


class CombinedDataView(APIView):

    def get_location_data(self, request):
        location_view = LocationView()
        location_response = location_view.get(request)
        if location_response.status_code == 200:
            location_data = location_response.data.get("results", [])
            if location_data:
                return location_data[0]
        return None

    def get_weather_data(self, lat, lon):
        weather_view = WeatherView()
        factory = RequestFactory()
        request = factory.get('/weather', {"latitude": lat, "longitude": lon})
        response = weather_view.get(request)
        if response.status_code == 200:
            weather_data = response.data.get("results", [])
            if weather_data:
                return weather_data[0]
        return None

    def get_food_data(self, lat, lon):
        food_view = FoodView()
        factory = RequestFactory()
        request = factory.get('/food', {"latitude": lat, "longitude": lon})
        response = food_view.get(request)
        if response.status_code == 200:
            return response.data.get("results", [])
        return []

    def get_flight_data(self, origin_name, destination_name, departure_date=None):
        flight_view = FlightView()
        factory = RequestFactory()

        params = {
            "origin": origin_name,
            "destination": destination_name,
        }
        if departure_date:
            params["departure_at"] = departure_date

        request = factory.get('/flights', params)
        response = flight_view.get(request)

        if response.status_code == 200:
            return response.data.get("results", [])

        return []

    def get(self, request):
        result = {}

        location_data = self.get_location_data(request)
        if not location_data:
            return Response({"error": "Miasto nie znalezione"}, status=status.HTTP_404_NOT_FOUND)

        result["location"] = location_data
        lat, lon = location_data["latitude"], location_data["longitude"]
        city_name = location_data["name"].split(",")[0]

        origin_name = request.GET.get("origin")
        departure_date = request.GET.get("departure_at")

        weather_data = self.get_weather_data(lat, lon)
        if weather_data:
            result["weather"] = weather_data

        food_data = self.get_food_data(lat, lon)
        if food_data:
            result["restaurants"] = food_data

        flight_data = self.get_flight_data(origin_name, city_name, departure_date)
        if flight_data:
            result["flights"] = flight_data

        return Response(result, status=status.HTTP_200_OK)
