import React, { useState } from 'react';
import { Search, Cloud, Droplets, Wind, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
  sys: {
    country: string;
  };
  wind: {
    speed: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
}

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = '7623677bdfa3e5942d38665c9a628b14';
  
  const fetchWeather = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError('Could not find weather data for this city');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-lg w-full max-w-md rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Weather Dashboard</h1>
        
        <form onSubmit={fetchWeather} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500"
              disabled={loading}
            >
              <Search size={20} />
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center text-gray-600">Loading weather data...</div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4 rounded">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {weather && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                {weather.name}, {weather.sys.country}
              </h2>
              <div className="mt-2">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  className="mx-auto"
                />
                <p className="text-4xl font-bold text-gray-800">
                  {Math.round(weather.main.temp)}°C
                </p>
                <p className="text-gray-600 capitalize">
                  {weather.weather[0].description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50/80 backdrop-blur p-4 rounded-lg">
                <div className="flex items-center text-blue-500 mb-2">
                  <Droplets size={20} className="mr-2" />
                  <span className="font-medium">Humidity</span>
                </div>
                <p className="text-2xl font-semibold text-gray-800">
                  {weather.main.humidity}%
                </p>
              </div>

              <div className="bg-blue-50/80 backdrop-blur p-4 rounded-lg">
                <div className="flex items-center text-blue-500 mb-2">
                  <Wind size={20} className="mr-2" />
                  <span className="font-medium">Wind Speed</span>
                </div>
                <p className="text-2xl font-semibold text-gray-800">
                  {weather.wind.speed} m/s
                </p>
              </div>

              <div className="bg-blue-50/80 backdrop-blur p-4 rounded-lg col-span-2">
                <div className="flex items-center text-blue-500 mb-2">
                  <Cloud size={20} className="mr-2" />
                  <span className="font-medium">Feels Like</span>
                </div>
                <p className="text-2xl font-semibold text-gray-800">
                  {Math.round(weather.main.feels_like)}°C
                </p>
              </div>
            </div>

            <div className="mt-6">
              <MapContainer
                center={[weather.coord.lat, weather.coord.lon]}
                zoom={10}
                scrollWheelZoom={false}
                className="shadow-lg"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[weather.coord.lat, weather.coord.lon]}>
                  <Popup>
                    {weather.name}, {weather.sys.country}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;