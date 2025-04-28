import React, { useState } from "react";
import FlightSearch from "./FlightSearch";
import DestinationInfoCard from "./DestinationInfoCard";
import './App.css';

const App = () => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async ({ origin, destination, departureAt }) => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    params.append("origin", origin);
    params.append("destination", destination);
    params.append("currency", "PLN");
    params.append("place", destination);
    if (departureAt) {
      params.append("departure_at", departureAt);
    }

    try {
      const response = await fetch(`http://localhost:8000/api/combined/?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setLocation(data.location?.results?.[0] || null);
      setWeather(data.weather?.results?.[0] || null);
      setRestaurants(data.restaurants.results || []);
      setFlights(data.flights.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="intro">
        <header>
          <h1>SmartTrip</h1>
          <p className="subtitle">Your intelligent travel assistant</p>
        </header>
        <FlightSearch onSearch={handleSearch} />
      </div>

      <div className={`results-container ${location || weather || flights.length ? "expanded" : ""}`}>
        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
            <p className="loader-text">Loading data...</p>
          </div>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {location && (
          <DestinationInfoCard
            location={location}
            weather={weather}
            restaurants={restaurants}
            flights={flights}
          />
        )}
      </div>
    </>
  );
};

export default App;
