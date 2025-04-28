import React from "react";

const DestinationCard = ({ location, weather, restaurants, flights }) => {
    return (
        <div className="destination-card">
            <h2>{location?.name || "Пункт назначения"}</h2>

            {weather && weather.length > 0 && (
                <div className="section">
                    <h3>Погода</h3>
                    <p><strong>Температура:</strong> {weather[0].temperature}°C</p>
                    <p><strong>Ветер:</strong> {weather[0].wind_speed} м/с</p>
                    <p><strong>Осадки:</strong> {weather[0].precipitation} мм</p>
                </div>
            )}

            {restaurants && restaurants.length > 0 && (
                <div className="section">
                    <h3>Рестораны</h3>
                    <ul className="restaurant-list">
                        {restaurants.slice(0, 10).map((r, i) => (
                            <li key={i}>{r.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {flights && flights.length > 0 && (
                <div className="section">
                    <h3>Билеты</h3>
                    {flights.map((f, i) => (
                        <div key={i} className="flight-summary">
                            <p>{f.origin} → {f.destination}</p>
                            <p><strong>{f.price} {f.currency || "USD"}</strong>, {new Date(f.departure_at).toLocaleString()}</p>
                            <a className="flight-link" href={`https://www.aviasales.ru${f.link}`} target="_blank" rel="noreferrer">Смотреть билет</a>
                            {f.more_link && (
                                <a className="flight-link secondary" href={f.more_link} target="_blank" rel="noreferrer">Остальные билеты</a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DestinationCard;
