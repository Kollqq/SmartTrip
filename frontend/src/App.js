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
  const [searchTicket, setSearchTicket] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async ({ origin, destination, departureAt, searchTicket }) => {
    setLoading(true);
    setError(null);
    setSearchTicket(searchTicket);
    setDataLoaded(false);
    setNotFound(false);

    const params = new URLSearchParams();
    params.append("origin", origin);
    params.append("destination", destination);
    params.append("place", destination);
    if (departureAt) {
      params.append("departure_at", departureAt);
    }

    try {
      const response = await fetch(`http://localhost:8000/api/combined/?${params.toString()}`);

      if (response.status === 404) {
        setNotFound(true);
        setLocation(null);
        setWeather(null);
        setRestaurants([]);
        setFlights([]);
        setDataLoaded(true);
        return;
      }

      if (!response.ok) {
        throw new Error("Nie udało się pobrać danych z serwera.");
      }

      const data = await response.json();

      setLocation(data.location || null);
      setWeather(data.weather || null);
      setRestaurants(data.restaurants || []);
      setFlights(data.flights || []);
    } catch (err) {
      console.error("Błąd podczas ładowania danych: ", err.message);
      setError("Nie udało się załadować danych. Spróbuj ponownie.");
    } finally {
      setLoading(false);
      setDataLoaded(true);
    }
  };

  const renderMessages = () => {
    if (loading) {
      return (
        <div className="loader-container">
          <div className="loader"></div>
          <p className="loader-text">Loading...</p>
        </div>
      );
    }
    if (error) {
      return <p style={{ color: "red" }}>{error}</p>;
    }
    if (notFound) {
      return (
        <div className="not-found-message">
          <p>Unfortunately, no data was found for this request.</p>
        </div>
      );
    }
    return null;
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
        {renderMessages()}
        {!notFound && location && (
          <DestinationInfoCard
            location={location}
            weather={weather}
            restaurants={restaurants}
            flights={flights}
            searchTicket={searchTicket}
            dataLoaded={dataLoaded}
          />
        )}
      </div>
    </>
  );
};

export default App;
