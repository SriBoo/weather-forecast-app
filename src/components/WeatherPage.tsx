import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// TypeScript interface for weather data
interface WeatherData {
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    high: number;
    low: number;
  }
  
const WeatherPage: React.FC = () => {
  const { cityName } = useParams<{ cityName: string }>(); // Get city name from URL parameters
  const [weather, setWeather] = useState<WeatherData | null>(null); // State for storing weather data
  const [error, setError] = useState<string | null>(null); // State for handling errors
  const API_KEY = process.env.d0dc979d89667265108925e755c3884; // Make sure this is correct
  console.log("API Key:", API_KEY); // Log the API key to check if it is being read correctly
 // Use environment variable for API key

  // Fetch weather data whenever the city name changes
  useEffect(() => {
    fetchWeather();
  }, [cityName]);

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      setWeather({
        temperature: response.data.main.temp,
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
        pressure: response.data.main.pressure,
        high: response.data.main.temp_max,
        low: response.data.main.temp_min,
      });
    } catch (error: any) {
      console.error("Error fetching weather data:", error);
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
          `Error: ${error.response?.status} - ${error.response?.statusText}`
        );
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!weather) return <p>Loading...</p>;

  // Determine background style and image based on weather conditions
  const backgroundClass =
    weather.description.toLowerCase().includes('rain')
      ? 'bg-blue-400 rain-animation'
      : weather.description.toLowerCase().includes('cloud')
      ? 'bg-gray-400 cloud-animation'
      : 'bg-yellow-400 sunny-animation';

  return (
    <div className={`p-4 ${backgroundClass} min-h-screen flex flex-col justify-center items-center`}>
  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">{cityName}</h1>
  <p className="text-xl sm:text-2xl">Temperature: {weather.temperature} °C</p>
  <p className="text-lg sm:text-xl">High: {weather.high} °C / Low: {weather.low} °C</p>
  <p className="text-lg sm:text-xl">Description: {weather.description}</p>
  <p className="text-lg sm:text-xl">Humidity: {weather.humidity}%</p>
  <p className="text-lg sm:text-xl">Wind Speed: {weather.windSpeed} m/s</p>
  <p className="text-lg sm:text-xl">Pressure: {weather.pressure} hPa</p>
</div>

  );
};

export default WeatherPage;
