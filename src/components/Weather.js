import React, { useEffect, useState } from "react";

const Weather = ({ isSplit }) => {
  const [weatherData, setWeatherData] = useState(null); // State to hold the weather data
  const [loading, setLoading] = useState(true); // State to track loading status

  /**
   * Fetches weather data using WeatherAPI based on the provided latitude and longitude.
   * latitude - The latitude of the user's location.
   * longitude - The longitude of the user's location.
   */
  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      try {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY; // API key from environment variables
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=1`
        );
        const data = await response.json();
        setWeatherData(data); // Update the weather data state
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false); // Stop loading on error
      }
    };

    /**
     * Gets the user's current location using the browser's geolocation API.
     * Calls `fetchWeather` with the retrieved coordinates.
     */
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords; // Extract latitude and longitude
        fetchWeather(latitude, longitude); // Fetch weather data
      },
      (error) => {
        console.error(
          "Error occurred while fetching location information:",
          error
        );
        setLoading(false); // Stop loading on error
      }
    );
  }, []);

  // Render a loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render an error message if weather data failed to load
  if (!weatherData) {
    return <div className="text-red-500">Failed to fetch weather data.</div>;
  }

  // Destructure necessary fields from the weather data
  const {
    current: { temp_f, condition }, // Current temperature and condition
    forecast: {
      forecastday: [
        {
          day: { maxtemp_f, mintemp_f }, // Maximum and minimum temperatures
        },
      ],
    },
    location: { name }, // Location name
  } = weatherData;

  return (
    <>
      <div className="hidden md:block">
        {!isSplit ? (
          <div className="text-white">
            <div className="flex items-center">
              <img
                src={condition.icon}
                alt={condition.text}
                className="w-20 h-20 mr-1"
              />
              <div className="flex-col font-bold text-lg">
                <p>
                  Today's weather is {condition.text} at {temp_f}°
                </p>
                <div className="flex space-x-3">
                  <p>H: {maxtemp_f}°</p>
                  <p>L: {mintemp_f}°</p>
                  <p>@ {name}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-white">
            <div className="flex items-center">
              <img
                src={condition.icon}
                alt={condition.text}
                className="w-20 h-20 mr-1"
              />
              <div className="flex-col items-center justify-center font-bold">
                <p className="text-sm">
                  {temp_f}°&nbsp;&nbsp; @ {name}
                </p>
                <p className="text-sm">{condition.text}</p>
                <p className="text-sm">
                  H: {maxtemp_f}°&nbsp;&nbsp; L: {mintemp_f}°
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="block md:hidden">
        <div className="text-white">
          <div className="flex items-center">
            <img
              src={condition.icon}
              alt={condition.text}
              className="w-16 h-16 mr-1"
            />
            <div className="flex-col items-center justify-center font-bold">
              <p className="text-sm">
                {temp_f}°&nbsp;&nbsp; @ {name}
              </p>
              <p className="text-sm">{condition.text}</p>

              <p className="text-sm">
                H: {maxtemp_f}°&nbsp;&nbsp; L: {mintemp_f}°
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Weather;
