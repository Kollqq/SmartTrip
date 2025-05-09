from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
import os
from dotenv import load_dotenv

load_dotenv()


class FlightView(APIView):
    API_URL = "https://api.travelpayouts.com/aviasales/v3/prices_for_dates"
    API_TOKEN = os.getenv("AVIASALES_API_TOKEN")
    AUTOCOMPLETE_URL = "https://autocomplete.travelpayouts.com/places2"

    def get_iata_code(self, city_name):
        params = {"term": city_name, "locale": "en"}
        try:
            response = requests.get(self.AUTOCOMPLETE_URL, params=params, timeout=5)
            response.raise_for_status()
            results = response.json()

            for place in results:
                if place.get("type") == "city" and place.get("code"):
                    return place.get("code")
        except requests.RequestException:
            return None

    def get(self, request):
        origin_city = request.GET.get("origin")
        destination_city = request.GET.get("destination")
        departure_at = request.GET.get("departure_at")
        currency = request.GET.get("currency", "pln")

        if not (origin_city and destination_city and departure_at):
            return Response({"error": "Parametry 'origin', 'destination' i 'departure_at' są obowiązkowe."},
                            status=status.HTTP_400_BAD_REQUEST)

        origin = self.get_iata_code(origin_city)
        destination = self.get_iata_code(destination_city)

        if not origin or not destination:
            return Response({"error": "Nie udało się znaleźć kodów IATA."}, status=status.HTTP_400_BAD_REQUEST)

        params = {
            "origin": origin,
            "destination": destination,
            "departure_at": departure_at,
            "token": self.API_TOKEN,
            "currency": currency,
            "one_way": "true",
        }

        try:
            response = requests.get(self.API_URL, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            flights = [
                {
                    "origin": item.get("origin"),
                    "destination": item.get("destination"),
                    "price": item.get("price"),
                    "airline": item.get("airline"),
                    "flight_number": item.get("flight_number"),
                    "destination_airport": item.get("destination_airport"),
                    "departure_at": item.get("departure_at"),
                    "transfers": item.get("transfers"),
                    "link": item.get("link"),
                    "more_link": f"https://www.aviasales.ru{item.get('link').split('?')[0]}" if item.get("link") else None
                }
                for item in data.get("data", [])
            ]

            return Response({"results": flights}, status=status.HTTP_200_OK)

        except requests.RequestException as e:
            return Response({"error": f"Błąd podczas żądania do API: {str(e)}"},
                            status=status.HTTP_502_BAD_GATEWAY)
