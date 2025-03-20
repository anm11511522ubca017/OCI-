import React, { useState } from 'react';
import axios from 'axios';
import { Search, Wind, Droplets, Thermometer } from 'lucide-react';
import type { WeatherData } from './types';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = 'e7451827c4aa3b17373adde670b23573'; // Replace with your OpenWeatherMap API key
  
  const fetchWeather = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      setCity('');
    } catch (err) {
      setError('City not found. Please try again.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-white">
        <h1 className="text-3xl font-bold text-center mb-8">Weather Dashboard</h1>
        
        <form onSubmit={fetchWeather} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/20 transition-colors"
              disabled={loading}
            >
              <Search size={20} />
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
            {error}
          </div>
        )}

        {weather && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">{weather.name}, {weather.sys.country}</h2>
              <div className="flex items-center justify-center mt-2">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  className="w-20 h-20"
                />
                <span className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</span>
              </div>
              <p className="text-xl capitalize">{weather.weather[0].description}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <Thermometer className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm">Feels Like</p>
                <p className="text-lg font-bold">{Math.round(weather.main.feels_like)}°C</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <Droplets className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm">Humidity</p>
                <p className="text-lg font-bold">{weather.main.humidity}%</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4 text-center">
                <Wind className="w-6 h-6 mx-auto mb-2" />
                <p className="text-sm">Wind Speed</p>
                <p className="text-lg font-bold">{weather.wind.speed} m/s</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;