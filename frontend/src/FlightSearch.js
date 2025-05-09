import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Switch from "react-switch";
import { format } from 'date-fns';

const FlightSearch = ({ onSearch }) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureAt, setDepartureAt] = useState("");
  const [searchTicket, setSearchTicket] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTicket && (!origin || !departureAt)) {
      alert("Please fill in all required fields");
      return;
    }
    onSearch({ origin, destination, departureAt: searchTicket ? departureAt : "", searchTicket });
  };

  const handleToggle = () => setSearchTicket(prevState => !prevState);

  const renderInput = (label, value, setValue, placeholder, required = false, disabled = false) => (
    <div className="form-group">
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="search-form">
      {renderInput("Departure city:", origin, setOrigin, "Enter city", searchTicket, !searchTicket)}
      {renderInput("Destination city:", destination, setDestination, "Enter city", true)}

      <div className="form-group">
        <label>Departure date:</label>
        <DatePicker
          selected={departureAt ? new Date(departureAt) : null}
          onChange={(date) => setDepartureAt(format(date, 'yyyy-MM-dd'))}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select departure date"
          disabled={!searchTicket}
          className="custom-datepicker"
        />
      </div>

      <button type="submit" className="primary-button">Let's fly!</button>

      <div className="switch-group">
        <Switch
          onChange={handleToggle}
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
