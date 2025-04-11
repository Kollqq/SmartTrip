from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from locations.views import LocationView

class WeatherView(APIView):
    """Получает текущую погоду по координатам, полученным из LocationView."""

    def get(self, request):
        # Вытягиваем координаты через LocationView
        location_view = LocationView()
        location_response = location_view.get(request)

        if location_response.status_code != 200:
            return Response({"error": "Не удалось получить координаты"}, status=status.HTTP_400_BAD_REQUEST)

        location_data = location_response.data.get("results", [])
        if not location_data:
            return Response({"error": "Город не найден"}, status=status.HTTP_404_NOT_FOUND)

        # Берем первую найденную локацию
        first_location = location_data[0]
        lat = first_location["latitude"]
        lon = first_location["longitude"]
        city = first_location["name"].split(",")[0]
        country = first_location.get("country", "Unknown")

        url = f"https://api.met.no/weatherapi/locationforecast/2.0/compact?lat={lat}&lon={lon}"

        try:
            response = requests.get(url, headers={"User-Agent": "SmartTripApp"}, timeout=5)
            data = response.json()
            forecast = data.get("properties", {}).get("timeseries", [])

            if not forecast:
                return Response({"error": "Прогноз не найден"}, status=status.HTTP_204_NO_CONTENT)

            current = forecast[0]["data"]["instant"]["details"]
            precipitation = forecast[0]["data"].get("next_1_hours", {}).get("details", {}).get("precipitation_amount", 0)

            result = {
                "city": city,
                "country": country,
                "temperature": current["air_temperature"],
                "wind_speed": current["wind_speed"],
                "precipitation": precipitation,
            }

            return Response({"results": [result]}, status=status.HTTP_200_OK)

        except requests.RequestException:
            return Response({"error": "Ошибка при получении погоды"}, status=status.HTTP_502_BAD_GATEWAY)
