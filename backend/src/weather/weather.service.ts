import { Injectable, Logger } from '@nestjs/common';

export interface WeatherSnapshot {
  provider: string;
  temperatureC?: number | null;
  feelsLikeC?: number | null;
  condition?: string | null;
  description?: string | null;
  humidity?: number | null;
  locationName?: string | null;
}

interface OpenWeatherSummary {
  name?: string;
  main?: {
    temp?: number;
    feels_like?: number;
    humidity?: number;
  };
  weather?: Array<{
    main?: string;
    description?: string;
  }>;
}

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  private readonly fallbackCoords = { lat: 33.8938, lon: 35.5018 };

  private get apiKey(): string | undefined {
    return process.env.OPENWEATHER_API_KEY ?? process.env.VITE_WEATHER_API_KEY;
  }

  /**
   * Fetches the current weather snapshot for a user.
   * Currently falls back to a default location until user-specific
   * coordinates are introduced.
   */
  async getCurrentWeatherForUser(userId?: number): Promise<WeatherSnapshot | null> {
    if (!this.apiKey) {
      this.logger.warn(
        'OPENWEATHER_API_KEY is not configured; weather-aware styling will be skipped.',
      );
      return null;
    }

    const { lat, lon } = this.fallbackCoords;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`OpenWeather request failed with status ${response.status}`);
      }

      const data = (await response.json()) as OpenWeatherSummary;
      return {
        provider: 'openweather',
        temperatureC: data.main?.temp ?? null,
        feelsLikeC: data.main?.feels_like ?? null,
        condition: data.weather?.[0]?.main ?? null,
        description: data.weather?.[0]?.description ?? null,
        humidity: data.main?.humidity ?? null,
        locationName: data.name ?? null,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown weather service failure';
      this.logger.error(`Failed to fetch weather for user ${userId ?? 'n/a'}: ${message}`);
      return null;
    }
  }
}
