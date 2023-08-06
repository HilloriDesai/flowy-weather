'use client'
import React, { useState, useEffect } from "react";
import axios from 'axios';

const CurrentWeather = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    return () => {
      setWeatherData(null);
      setErrorMessage("");
    };
  }, [location]);

  const fetchWeatherData = async (location) => {
    if (!location.trim()) {
      setErrorMessage('Please enter a valid location.'); // Handle empty location
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/weather?location=${location}`);
      setWeatherData(response.data);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to fetch weather data. Please make sure that the city name is correct.'); // Handle backend error
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLocation(searchQuery);
    fetchWeatherData(searchQuery);
  }

  return (
    <div className="w-full px-10 py-5 relative">
        <div className="iterms-center">
          <h1 className="text-white py-5 text-center text-3xl font-bold">Flowy Weather App</h1>
        </div>
        <div className="relative">
          <div className="absolute w-full inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
          </div>
          <input
              type="text"
              placeholder="Enter City Name..."
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={searchQuery}
              onChange={handleChange}
          />
          <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleSubmit}>
              Get Weather
          </button>
        </div>
    <div>
    {
        weatherData?
        (
            <div className="block my-6 p-4 bg-gray-800 border border-gray-300 rounded-lg">
                <h1 className="text-xl	font-medium text-white">{location} Weather</h1>
                <h4>
                <span className="text-base font-thin text-white">Feels like {weatherData.main.temp}°C with {weatherData.wind.speed} km/h wind speed and {weatherData.main.humidity}% humidity</span>
                </h4>
                <h2>
                <span className="py-2 font-semibold text-white">Temperature:</span> {weatherData.main.temp}°C
                </h2>
                <h2>
                <span className="py-2 font-semibold text-white">Humidity:</span> {weatherData.main.humidity}%
                </h2>
                <h2>
                <span className="py-2 font-semibold text-white">Wind:</span> {weatherData.wind.speed} km/h
                </h2>

            </div>
        ):
        errorMessage ? 
        (
          <div className="block text-semibold w-full my-6 p-4 bg-red-900 border border-gray-300 rounded-lg text-white">
            {errorMessage}
          </div>
        ) :
        null
    }
        </div>
    </div>
  );
};

export default CurrentWeather;