import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MdWaterDrop } from "react-icons/md";
import { FaThermometerHalf } from "react-icons/fa";
import { FiWind } from "react-icons/fi";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const DestinationInfoCard = ({ location, weather, restaurants, flights }) => {
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
                  style={{ verticalAlign: 'baseline', marginRight: '8px', width: '30px', height: '24px', borderRadius: '2px', border: '1px solid #000' }}
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
        {/* Left — Weather */}
        <div className="weather-info">
          <h3>Weather</h3>
          {weather && (
            <div>
              <p>
                <FaThermometerHalf size={30} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                <strong>Temperature:</strong> {weather.temperature}°C
              </p>
              <p>
                <FiWind size={30} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                <strong>Wind:</strong> {weather.wind_speed} m/s
              </p>
              <p>
                <MdWaterDrop size={30} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
                <strong>Precipitation:</strong> {weather.precipitation} mm
              </p>
            </div>
          )}
        </div>

        {/* Right — Map with restaurants */}
        <div className="map-container">
          <h3>Restaurants</h3>
          <MapContainer
              key={`${cityCoordinates[0]}-${cityCoordinates[1]}`}
              center={cityCoordinates}
              zoom={10}
              style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {restaurants.map((restaurant, index) => (
              <Marker
                key={index}
                position={[restaurant.latitude, restaurant.longitude]}
                icon={
                  new Icon({
                    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg",
                    iconSize: [20, 20],
                  })
                }
              >
                <Popup>
                  <strong>{restaurant.name}</strong><br />
                  {restaurant.category}<br />
                  {restaurant.latitude}, {restaurant.longitude}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Section with tickets */}
      {flights.length > 0 && (
        <div className="flight-info">
          {flights.map((flight, index) => {
            const shortLink = flight.link.split('?')[0];

            return (
                <div key={index} className="flight-card">
                    <h3>Cheapest ticket!</h3>
                    <p>{flight.origin} → {flight.destination} ({flight.destination_airport})</p>
                    <p>
                        <strong>{flight.price} {flight.currency || "PLN"}</strong>, {new Date(flight.departure_at).toLocaleString()}
                    </p>

                    <a className="flight-link" href={`https://www.aviasales.ru${flight.link}`} target="_blank"
                       rel="noreferrer">View ticket</a>

                    <a className="flight-link secondary" href={`https://www.aviasales.ru${shortLink}`} target="_blank"
                       rel="noreferrer">
                        Other tickets for this date
                    </a>
                </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DestinationInfoCard;
