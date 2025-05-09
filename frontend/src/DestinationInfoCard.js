import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { MdWaterDrop } from "react-icons/md";
import { FaThermometerHalf } from "react-icons/fa";
import { FiWind } from "react-icons/fi";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const WeatherItem = ({ icon: IconComponent, label, value }) => (
  <p>
    <IconComponent size={30} style={{ verticalAlign: "middle", marginRight: "8px" }} />
    <strong>{label}:</strong> {value}
  </p>
);

const FlightCard = ({ flight }) => {
  const shortLink = flight.link.split("?")[0];

  return (
    <div className="flight-card">
      <h3>Cheapest ticket!</h3>
      <p>
        {flight.origin} → {flight.destination} ({flight.destination_airport})
      </p>
      <p>
        <strong>
          {flight.price} {flight.currency || "PLN"}
        </strong>
        , {new Date(flight.departure_at).toLocaleString()}
      </p>

      <a
        className="flight-link"
        href={`https://www.aviasales.com${flight.link}`}
        target="_blank"
        rel="noreferrer"
      >
        View ticket
      </a>

      <a
        className="flight-link secondary"
        href={`https://www.aviasales.com${shortLink}`}
        target="_blank"
        rel="noreferrer"
      >
        Other tickets for this date
      </a>
    </div>
  );
};

const MapUpdater = ({ coordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates) {
      map.setView(coordinates, 10, {
        animate: true,
        duration: 0.5
      });
    }
  }, [coordinates, map]);

  return null;
};

const formatCoordinates = (latitude, longitude) => {
  return `(${latitude.toFixed(5)}, ${longitude.toFixed(5)})`;
};

const DestinationInfoCard = ({ location, weather, restaurants, flights, searchTicket, dataLoaded }) => {
  const cityCoordinates = location ? [location.latitude, location.longitude] : [51.505, -0.09];

  return (
    <div className="info-card">
      <header className="destination-header">
        <h1>
          {location ? (
            <>
              {location.country_code && (
                <img
                  src={`https://flagcdn.com/w40/${location.country_code.toLowerCase()}.png`}
                  alt={`${location.country} flag`}
                  className="flag-icon"
                />
              )}
              {location.name.split(",")[0]}, {location.country}
            </>
          ) : (
            "City not found"
          )}
        </h1>
      </header>

      <div className="destination-content">
        <div className="weather-info">
          <h3>Weather</h3>
          {weather && (
            <>
              <WeatherItem icon={FaThermometerHalf} label="Temperature" value={`${weather.temperature}°C`} />
              <WeatherItem icon={FiWind} label="Wind" value={`${weather.wind_speed} m/s`} />
              <WeatherItem icon={MdWaterDrop} label="Precipitation" value={`${weather.precipitation} mm`} />
            </>
          )}
        </div>

        <div className="map-container">
          <h3>Restaurants</h3>
          <MapContainer center={cityCoordinates} zoom={10} style={{ height: "300px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapUpdater coordinates={cityCoordinates} />
            <>
              {restaurants.map((restaurant, index) => (
                <Marker
                  key={index}
                  position={[restaurant.latitude, restaurant.longitude]}
                  icon={new Icon({ iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg", iconSize: [20, 20] })}
                >
                  <Popup>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#007bff", fontWeight: "bold", textDecoration: "none" }}
                    >
                      {restaurant.name}
                    </a>
                    <br />
                    {restaurant.category}
                    <br />
                    <small>{formatCoordinates(restaurant.latitude, restaurant.longitude)}</small>
                  </Popup>
                </Marker>
              ))}
            </>
          </MapContainer>
        </div>
      </div>

      <div className="flight-info">
        {dataLoaded && searchTicket && flights.length === 0 && (
          <p className="no-tickets-message">
            <strong>Ticket not found</strong>
          </p>
        )}

        {flights.length > 0 && flights.map((flight, index) => (
          <FlightCard key={index} flight={flight} />
        ))}
      </div>
    </div>
  );
};

export default DestinationInfoCard;
