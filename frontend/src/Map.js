import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = () => {
    return (
        <div className="map-container">
            <h2>Карта</h2>
            <MapContainer
                center={[51.505, -0.09]} // Начальные координаты карты (например, Лондон)
                zoom={13}
                style={{ height: "400px", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
            </MapContainer>
        </div>
    );
};

export default Map;
