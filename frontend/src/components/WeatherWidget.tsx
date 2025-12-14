import { useEffect, useState } from "react";
import { weatherWidgetStyles } from "../styles/weatherWidgetStyles";

interface WeatherDescription {
  icon: string;
  main: string;
}

interface OpenWeatherSummary {
  name: string;
  main: {
    temp: number;
  };
  weather: WeatherDescription[];
}

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const FALLBACK_COORDS = { lat: 33.8938, lon: 35.5018 };

/**
 * Displays current weather for the user's geolocated city (falls back to Beirut).
 *
 * Preconditions:
 * - Browser must permit fetch; optional geolocation permission improves accuracy.
 *
 * Postconditions:
 * - Shows loading/error states before rendering the resolved temperature/conditions.
 */
export default function WeatherWidget() {
  const [weather, setWeather] = useState<OpenWeatherSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!WEATHER_API_KEY) {
      setError("Weather API key is not configured.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchByCoords = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch weather");
        }
        const data = (await response.json()) as OpenWeatherSummary;
        if (isMounted) {
          setWeather(data);
          setError(null);
        }
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }
        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to fetch weather.";
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const loadWeather = () => {
      if (!("geolocation" in navigator)) {
        fetchByCoords(FALLBACK_COORDS.lat, FALLBACK_COORDS.lon).catch(() => undefined);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchByCoords(position.coords.latitude, position.coords.longitude).catch(() =>
            fetchByCoords(FALLBACK_COORDS.lat, FALLBACK_COORDS.lon).catch(() => undefined),
          );
        },
        () => {
          fetchByCoords(FALLBACK_COORDS.lat, FALLBACK_COORDS.lon).catch(() => undefined);
        },
        { maximumAge: 15 * 60 * 1000 },
      );
    };

    loadWeather();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p style={weatherWidgetStyles.loadingText}>Checking the weather...</p>;
  }

  if (error || !weather) {
    return <p style={weatherWidgetStyles.errorText}>Weather unavailable right now.</p>;
  }

  const icon = weather.weather[0]?.icon;
  const condition = weather.weather[0]?.main ?? "-";

  return (
    <div style={weatherWidgetStyles.container}>
      {icon && (
        <img
          alt="Weather icon"
          src={`https://openweathermap.org/img/w/${icon}.png`}
          style={weatherWidgetStyles.icon}
        />
      )}

      <div>
        <div style={weatherWidgetStyles.city}>{weather.name}</div>
        <div style={weatherWidgetStyles.meta}>
          {Math.round(weather.main.temp)}
          {"\u00B0C"} {"\u2022"} {condition}
        </div>
      </div>
    </div>
  );
}
