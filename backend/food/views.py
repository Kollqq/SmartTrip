from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests

class FoodView(APIView):
    OVERPASS_URL = "https://overpass-api.de/api/interpreter"

    def build_query(self, lat, lon):
        return f"""
        [out:json];
        (
          node["amenity"="cafe"](around:10000,{lat},{lon});
          node["amenity"="restaurant"](around:10000,{lat},{lon});
        );
        out body;
        """

    def get(self, request):
        latitude = request.GET.get("latitude")
        longitude = request.GET.get("longitude")

        if not (latitude and longitude):
            return Response({"error": "Parametry 'latitude' i 'longitude' są obowiązkowe."},
                            status=status.HTTP_400_BAD_REQUEST)

        query = self.build_query(latitude, longitude)

        try:
            response = requests.get(self.OVERPASS_URL, params={"data": query}, timeout=10)
            response.raise_for_status()
            data = response.json()

            if "elements" not in data or not data["elements"]:
                return Response({"error": "Nie znaleziono miejsc."}, status=status.HTTP_404_NOT_FOUND)

            places = [
                {
                    "name": element.get("tags", {}).get("name", "Nieznane miejsce"),
                    "latitude": element.get("lat"),
                    "longitude": element.get("lon"),
                    "category": element.get("tags", {}).get("amenity", "Nieznana kategoria")
                }
                for element in data["elements"]
                if element.get("tags", {}).get("name")
            ]

            return Response({"results": places[:100]}, status=status.HTTP_200_OK)

        except requests.RequestException as e:
            return Response({"error": f"Błąd podczas żądania do Overpass API: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
