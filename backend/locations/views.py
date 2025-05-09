from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests

class LocationView(APIView):
    NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
    HEADERS = {"User-Agent": "SmartTripApp"}

    def get(self, request):
        place = request.GET.get("place", "Paris").strip()
        params = {
            "q": place,
            "format": "json",
            "addressdetails": 1,
            "accept-language": "en",
        }

        try:
            response = requests.get(self.NOMINATIM_URL, headers=self.HEADERS, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()

            if not data:
                return Response({"error": "Miejsce nie zostało znalezione."}, status=status.HTTP_404_NOT_FOUND)

            item = data[0]
            result = {
                "name": item["display_name"],
                "latitude": item["lat"],
                "longitude": item["lon"],
                "country": item.get("address", {}).get("country", ""),
                "country_code": item.get("address", {}).get("country_code", "").upper(),
            }

            return Response({"results": [result]}, status=status.HTTP_200_OK)

        except requests.RequestException as e:
            return Response({"error": f"Błąd podczas żądania do OpenStreetMap: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
