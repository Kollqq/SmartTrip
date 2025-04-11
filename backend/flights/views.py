from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
import os
from dotenv import load_dotenv

# Загрузка переменных окружения из .env файла
load_dotenv()

class FlightView(APIView):
    """
    Получение списка дешёвых авиабилетов с Aviasales API (Travelpayouts).
    """
    AVIASALES_URL = "https://api.travelpayouts.com/aviasales/v3/prices_for_dates"
    API_TOKEN = os.getenv("AVIASALES_API_TOKEN")  # Получаем токен из переменной окружения

    def get(self, request):
        origin = request.GET.get("origin")  # IATA код города отправления
        destination = request.GET.get("destination")  # IATA код города назначения
        currency = request.GET.get("currency", "rub")  # Валюта

        if not origin:
            return Response({"error": "Параметр 'origin' обязателен."}, status=status.HTTP_400_BAD_REQUEST)

        params = {
            "origin": origin,
            "currency": currency,
            "token": self.API_TOKEN,
        }

        if destination:
            params["destination"] = destination

        try:
            response = requests.get(self.AVIASALES_URL, params=params)
            response.raise_for_status()
            data = response.json()

            if not data.get("data"):
                return Response({"error": "Рейсы не найдены."}, status=status.HTTP_404_NOT_FOUND)

            flights = []
            for item in data["data"]:
                if item.get("price") and item.get("departure_at"):
                    flight = {
                        "origin": item.get("origin"),
                        "destination": item.get("destination"),
                        "price": item.get("price"),
                        "airline": item.get("airline"),
                        "flight_number": item.get("flight_number"),
                        "departure_at": item.get("departure_at"),
                        "return_at": item.get("return_at"),
                        "transfers": item.get("transfers"),
                        "link": item.get("link"),
                    }
                    flights.append(flight)

            return Response({"results": flights[:5]}, status=status.HTTP_200_OK)

        except requests.RequestException as e:
            return Response({"error": f"Ошибка при обращении к Aviasales API: {str(e)}"},
                             status=status.HTTP_502_BAD_GATEWAY)
