import React from "react";
import RestaurantsMap from "./RestaurantsMap"; // Импортируем компонент карты

const RestaurantsList = ({ restaurants, location }) => {
  return (
    <div className="info-card">
      <h2>Рестораны</h2>
      {/* Если рестораны есть, показываем карту */}
      <RestaurantsMap restaurants={restaurants} location={location} />
    </div>
  );
};

export default RestaurantsList;
