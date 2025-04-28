import React from "react";

const DestinationInfo = ({ location }) => {
    return (
        <div className="info-card">
            <h2>Информация о пункте назначения</h2>
            <p><strong>Город:</strong> {location.name}</p>
            <p><strong>Страна:</strong> {location.country} ({location.country_code})</p>
            <p><strong>Координаты:</strong> {location.latitude}, {location.longitude}</p>
        </div>
    );
};

export default DestinationInfo;