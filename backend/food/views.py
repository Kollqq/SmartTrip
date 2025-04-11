from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests


class FoodView(APIView):
    def get(self, request):
        place = request.GET.get("place", "Paris").strip()
        overpass_url = "https://overpass-api.de/api/interpreter"

        query = f"""
        [out:json];
        area["name"="{place}"]->.searchArea;
        (
          node["amenity"="cafe"](area.searchArea);
          node["amenity"="restaurant"](area.searchArea);
        );
        out body;
        """

        try:
            response = requests.get(overpass_url, params={"data": query}, timeout=10)
            data = response.json()

            if "elements" not in data or not data["elements"]:
                return Response({"error": f"Заведения в '{place}' не найдены"}, status=status.HTTP_404_NOT_FOUND)

            places = []
            for element in data["elements"]:
                tags = element.get("tags", {})
                name = tags.get("name", "Неизвестное заведение")
                category = tags.get("amenity", "Unknown")

                # Убираем рейтинговые данные
                places.append({
                    "name": name,
                    "latitude": element.get("lat"),
                    "longitude": element.get("lon"),
                    "category": category,
                })


            return Response({"results": places[:5]}, status=status.HTTP_200_OK)

        except requests.RequestException as e:
            return Response({"error": f"Ошибка при запросе к Overpass API: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
