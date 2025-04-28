from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests


class FoodView(APIView):
    def get(self, request):
        latitude = request.GET.get("latitude")
        longitude = request.GET.get("longitude")

        if not (latitude and longitude):
            return Response({"error": "Параметры 'latitude' и 'longitude' обязательны."}, status=status.HTTP_400_BAD_REQUEST)

        overpass_url = "https://overpass-api.de/api/interpreter"

        # Ищем кафе и рестораны в радиусе 10 км
        query = f"""
        [out:json];
        (
          node["amenity"="cafe"](around:10000,{latitude},{longitude});
          node["amenity"="restaurant"](around:10000,{latitude},{longitude});
        );
        out body;
        """

        try:
            response = requests.get(overpass_url, params={"data": query}, timeout=10)
            data = response.json()

            if "elements" not in data or not data["elements"]:
                return Response({"error": "Заведения не найдены"}, status=status.HTTP_404_NOT_FOUND)

            places = []
            for element in data["elements"]:
                tags = element.get("tags", {})
                name = tags.get("name", "Unknown place")
                category = tags.get("amenity", "Unknown")

                if name == "Unknown place":
                    continue

                places.append({
                    "name": name,
                    "latitude": element.get("lat"),
                    "longitude": element.get("lon"),
                    "category": category,
                })

            return Response({"results": places[:100]}, status=status.HTTP_200_OK)

        except requests.RequestException as e:
            return Response({"error": f"Ошибка при запросе к Overpass API: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

