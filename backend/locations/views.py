from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests


class LocationView(APIView):
    def get(self, request):
        place = request.GET.get("place", "Paris").strip()
        headers = {"User-Agent": "SmartTripApp"}

        # Формируем URL запроса к Nominatim
        search_url = f"https://nominatim.openstreetmap.org/search?q={place}&format=json&addressdetails=1&accept-language=en"

        try:
            response = requests.get(search_url, headers=headers, timeout=5)
            data = response.json()

            if not data:
                return Response({"error": "Место не найдено"}, status=status.HTTP_404_NOT_FOUND)

            # Берём первый результат
            item = data[0]
            city_name = item["display_name"]
            latitude = item["lat"]
            longitude = item["lon"]
            country = item.get("address", {}).get("country", "")
            country_code = item.get("address", {}).get("country_code", "").upper()

            result = {
                "name": city_name,
                "latitude": latitude,
                "longitude": longitude,
                "country": country,
                "country_code": country_code,
            }

            return Response({"results": [result]}, status=status.HTTP_200_OK)

        except requests.RequestException as e:
            return Response({"error": f"Ошибка при запросе к OpenStreetMap: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
