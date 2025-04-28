import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Switch from "react-switch"; // Импортируем красивый тумблер

const FlightSearch = ({ onSearch }) => {
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [departureAt, setDepartureAt] = useState("");
    const [searchTicket, setSearchTicket] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ origin, destination, departureAt: searchTicket ? departureAt : "" });
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <div className="form-group">
                <label>Departure city:</label>
                <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Enter city"
                    required
                />
            </div>

            <div className="form-group">
                <label>Destination city:</label>
                <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter city"
                    required
                />
            </div>

            <div className="form-group">
                <label>Departure date:</label>
                <DatePicker
                    selected={departureAt ? new Date(departureAt) : null}
                    onChange={(date) => {
                        const formattedDate = date.toISOString().split('T')[0];
                        setDepartureAt(formattedDate);
                    }}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select departure date"
                    disabled={!searchTicket}
                    className="custom-datepicker"
                />
            </div>

            <button type="submit" className="primary-button">Let's fly!</button>

            <div className="switch-group">
                <Switch
                    onChange={() => setSearchTicket(!searchTicket)}
                    checked={searchTicket}
                    onColor="#4CAF50"
                    offColor="#ccc"
                    onHandleColor="#fff"
                    offHandleColor="#fff"
                    handleDiameter={22}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    height={28}
                    width={58}
                    className="react-switch"
                />
                <label className="switch-label">Search for a ticket</label>
            </div>
        </form>
    );
};

export default FlightSearch;
