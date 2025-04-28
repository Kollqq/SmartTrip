import React from "react";

const FlightResults = ({ flights }) => {
    return (
        <div className="flight-results">
            <h2>Самый дешёвый билет!</h2>
            <ul>
                {flights.map((flight, index) => (
                    <li key={index} className="flight-card">
                        <p><strong>Откуда:</strong> {flight.origin || "—"}</p>
                        <p><strong>Куда:</strong> {flight.destination || "—"}</p>
                        <p><strong>Аэропорт:</strong> {flight.destination_airport || "—"}</p>
                        <p><strong>Дата вылета:</strong> {flight.departure_at ? new Date(flight.departure_at).toLocaleString() : "—"}</p>
                        <p><strong>Цена:</strong> {flight.price ? `${flight.price} ${flight.currency || "USD"}` : "—"}</p>
                        <p><strong>Авиакомпания:</strong> {flight.airline || "—"}</p>
                        <p><strong>Номер рейса:</strong> {flight.flight_number || "—"}</p>
                        <p><strong>Количество пересадок:</strong> {flight.transfers ?? "—"}</p>

                        {flight.link && (
                            <a
                                className="flight-button"
                                href={`https://www.aviasales.ru${flight.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Перейти к билету
                            </a>
                        )}

                        {flight.more_link && (
                            <a
                                className="flight-button secondary"
                                href={flight.more_link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Остальные билеты на эту дату
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FlightResults;
