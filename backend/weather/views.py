from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests


class WeatherView(APIView):
    WEATHER_API_URL = "https://api.met.no/weatherapi/locationforecast/2.0/compact"
    HEADERS = {"User-Agent": "SmartTripApp"}

    def get_weather_data(self, lat, lon):
        url = f"{self.WEATHER_API_URL}?lat={lat}&lon={lon}"
        response = requests.get(url, headers=self.HEADERS, timeout=5)
        response.raise_for_status()
        return response.json()

    def get(self, request):
        latitude = request.GET.get("latitude")
        longitude = request.GET.get("longitude")

        if not (latitude and longitude):
            return Response({"error": "Współrzędne 'latitude' i 'longitude' są wymagane."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            data = self.get_weather_data(latitude, longitude)
            forecast = data.get("properties", {}).get("timeseries", [])

            if not forecast:
                return Response({"error": "Prognoza nie została znaleziona."}, status=status.HTTP_204_NO_CONTENT)

            current = forecast[0]["data"]["instant"]["details"]
            precipitation = forecast[0]["data"].get("next_1_hours", {}).get("details", {}).get("precipitation_amount", 0)

            result = {
                "temperature": current["air_temperature"],
                "wind_speed": current["wind_speed"],
                "precipitation": precipitation,
            }

            return Response({"results": [result]}, status=status.HTTP_200_OK)

        except requests.RequestException as e:
            return Response({"error": f"Błąd podczas uzyskiwania danych pogodowych: {str(e)}"},
                            status=status.HTTP_502_BAD_GATEWAY)
