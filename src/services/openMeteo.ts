import { ForecastResponse, GeoLocation } from '../types/weather.ts';

export const DEFAULT_CITIES: GeoLocation[] = [
  {
    id: 1850147,
    name: 'Tokyo',
    latitude: 35.6895,
    longitude: 139.6917,
    country: 'Japan',
    country_code: 'JP',
    admin1: 'Tokyo',
    timezone: 'Asia/Tokyo',
    elevation: 44,
  },
  {
    id: 2643743,
    name: 'London',
    latitude: 51.5085,
    longitude: -0.1257,
    country: 'United Kingdom',
    country_code: 'GB',
    admin1: 'England',
    timezone: 'Europe/London',
    elevation: 25,
  },
  {
    id: 5128581,
    name: 'New York',
    latitude: 40.7143,
    longitude: -74.006,
    country: 'United States',
    country_code: 'US',
    admin1: 'New York',
    timezone: 'America/New_York',
    elevation: 10,
  },
  {
    id: 2988507,
    name: 'Paris',
    latitude: 48.8534,
    longitude: 2.3488,
    country: 'France',
    country_code: 'FR',
    admin1: 'Île-de-France',
    timezone: 'Europe/Paris',
    elevation: 42,
  },
  {
    id: 5391959,
    name: 'San Francisco',
    latitude: 37.7749,
    longitude: -122.4194,
    country: 'United States',
    country_code: 'US',
    admin1: 'California',
    timezone: 'America/Los_Angeles',
    elevation: 16,
  },
  {
    id: 2147714,
    name: 'Sydney',
    latitude: -33.8678,
    longitude: 151.2073,
    country: 'Australia',
    country_code: 'AU',
    admin1: 'New South Wales',
    timezone: 'Australia/Sydney',
    elevation: 58,
  },
  {
    id: 292223,
    name: 'Dubai',
    latitude: 25.0772,
    longitude: 55.3093,
    country: 'United Arab Emirates',
    country_code: 'AE',
    admin1: 'Dubai',
    timezone: 'Asia/Dubai',
    elevation: 11,
  },
];

/**
 * Searches cities using Open-Meteo Geocoding API
 */
export async function searchCities(query: string): Promise<GeoLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmed
  )}&count=8&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Geocoding HTTP error ${res.status}`);
    }
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }
    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      elevation: item.elevation,
      country: item.country,
      country_code: item.country_code,
      admin1: item.admin1,
      admin2: item.admin2,
      timezone: item.timezone || 'auto',
      population: item.population,
    }));
  } catch (err) {
    console.error('Failed to search cities:', err);
    return [];
  }
}

/**
 * Fetches current weather and 7-day forecast from Open-Meteo Forecast API
 */
export async function fetchWeatherForecast(
  latitude: number,
  longitude: number,
  timezone: string = 'auto'
): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'uv_index',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'uv_index',
      'visibility',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
    ].join(','),
    timezone: timezone || 'auto',
    forecast_days: '7',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`Open-Meteo API error ${res.status}: ${errorBody}`);
  }

  const data: ForecastResponse = await res.json();
  return data;
}

/**
 * Creates a fallback location object from browser GPS coordinates
 */
export async function resolveLocationFromCoords(lat: number, lon: number): Promise<GeoLocation> {
  // Attempt reverse geocoding via Open-Meteo geocoding search or free reverse nominatim
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      { headers: { 'User-Agent': 'AuraWeatherIntelligenceApp/1.0' } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const cityName =
        addr.city || addr.town || addr.village || addr.municipality || addr.county || 'My Location';
      return {
        id: Math.floor(lat * 1000 + lon * 1000),
        name: cityName,
        latitude: lat,
        longitude: lon,
        country: addr.country,
        country_code: addr.country_code ? addr.country_code.toUpperCase() : undefined,
        admin1: addr.state || addr.region,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
      };
    }
  } catch (e) {
    // ignore and fallback
  }

  return {
    id: Math.floor(lat * 10000 + lon * 10000),
    name: 'Current Coordinates',
    latitude: lat,
    longitude: lon,
    admin1: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
  };
}
