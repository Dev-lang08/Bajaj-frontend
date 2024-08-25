import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    {
      value: "highest_lowercase_alphabet",
      label: "Highest lowercase alphabet",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponse(null);
    setSelectedOptions([]);

    let parsedData;
    try {
      parsedData = JSON.parse(jsonInput);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error('JSON must contain a "data" array.');
      }
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      return;
    }

    try {
      const backendUrl = "https://bajaj-backend-ifeo.onrender.com/bfhl";
      const res = await axios.post(backendUrl, parsedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setResponse(res.data);
    } catch (err) {
      setError(
        `Error from backend: ${
          err.response
            ? err.response.data.error || err.response.statusText
            : err.message
        }`
      );
    }
  };

  const handleOptionChange = (selected) => {
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (!response) return null;

    const filteredResponse = {};
    selectedOptions.forEach((option) => {
      const key = option.value;
      if (key in response) {
        filteredResponse[key] = response[key];
      }
    });

    return (
      <div className="response">
        <h2>Filtered Response:</h2>
        {Object.entries(filteredResponse).map(([key, value]) => (
          <p key={key}>
            <strong>{key.replace(/_/g, " ")}:</strong>{" "}
            {Array.isArray(value) ? value.join(", ") : value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>21BAI1474</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="jsonInput">API Input</label>
          <textarea
            id="jsonInput"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows="10"
            cols="50"
            placeholder='e.g., { "data": ["A","C","z"] }'
          ></textarea>
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Submit</button>
      </form>

      {response && (
        <div className="dropdown">
          <label htmlFor="filter">Multi Filter</label>
          <Select
            isMulti
            name="filter"
            options={options}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleOptionChange}
          />
        </div>
      )}

      {selectedOptions.length > 0 && renderResponse()}
    </div>
  );
}

export default App;
