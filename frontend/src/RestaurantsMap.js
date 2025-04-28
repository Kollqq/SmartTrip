import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const RestaurantsMap = ({ restaurants, location }) => {
  // Если есть координаты города, используем их как центр карты
  const cityCoordinates = location ? [location.latitude, location.longitude] : [51.505, -0.09];

  return (
    <MapContainer
      center={cityCoordinates} // Используем координаты из location
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
            <strong>{restaurant.name}</strong>
            <br />
            {restaurant.category}
            <br />
            {restaurant.latitude}, {restaurant.longitude}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default RestaurantsMap;
