import React from "react";

const WeatherInfo = ({ weather }) => {
    return (
        <div className="info-card">
            <h2>Погода</h2>
            <p><strong>Город:</strong> {weather.city}</p>
            <p><strong>Температура:</strong> {weather.temperature} °C</p>
            <p><strong>Скорость ветра:</strong> {weather.wind_speed} м/с</p>
            <p><strong>Осадки:</strong> {weather.precipitation} мм</p>
        </div>
    );
};

export default WeatherInfo;
