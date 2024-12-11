import React, { useEffect, useState } from "react";

const Weather = ({ isSplit }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      try {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=1`
        );
        const data = await response.json();
        setWeatherData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
      },
      (error) => {
        console.error(
          "Error occurred while fetching location information:",
          error
        );
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!weatherData) {
    return <div className="text-red-500">Failed to fetch weather data.</div>;
  }

  const {
    current: { temp_f, condition },
    forecast: {
      forecastday: [
        {
          day: { maxtemp_f, mintemp_f },
        },
      ],
    },
    location: { name },
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
