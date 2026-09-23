/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle, RefreshCw, Compass } from 'lucide-react';
import { ForecastResponse, GeoLocation, UnitSystem } from './types/weather.ts';
import {
  DEFAULT_CITIES,
  fetchWeatherForecast,
  resolveLocationFromCoords,
} from './services/openMeteo.ts';
import {
  calculateActivityScores,
  generateOutfitAdvisor,
  analyzeWeeklyOutlook,
} from './services/intelligence.ts';
import { Header } from './components/Header.tsx';
import { CitySearch } from './components/CitySearch.tsx';
import { CurrentWeatherHero } from './components/CurrentWeatherHero.tsx';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid.tsx';
import { HourlyForecastReel } from './components/HourlyForecastReel.tsx';
import { DailyForecastList } from './components/DailyForecastList.tsx';
import { PlanningIntelligence } from './components/PlanningIntelligence.tsx';

const FAVORITES_KEY = 'aura_weather_favorites_v1';
const UNIT_KEY = 'aura_weather_unit_v1';
const LAST_CITY_KEY = 'aura_weather_last_city_v1';

export default function App() {
  // State for user preferences
  const [unit, setUnit] = useState<UnitSystem>(() => {
    return (localStorage.getItem(UNIT_KEY) as UnitSystem) || 'metric';
  });

  const [favorites, setFavorites] = useState<GeoLocation[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current active location
  const [location, setLocation] = useState<GeoLocation>(() => {
    try {
      const saved = localStorage.getItem(LAST_CITY_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_CITIES[0]; // Tokyo default
    } catch {
      return DEFAULT_CITIES[0];
    }
  });

  // Forecast data & loading states
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem(UNIT_KEY, unit);
  }, [unit]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(LAST_CITY_KEY, JSON.stringify(location));
  }, [location]);

  // Load weather data for the current location
  const loadWeatherData = useCallback(
    async (loc: GeoLocation, silent = false) => {
      if (!silent) setIsLoading(true);
      else setIsRefreshing(true);
      setErrorMessage(null);

      try {
        const data = await fetchWeatherForecast(loc.latitude, loc.longitude, loc.timezone);
        setForecast(data);
      } catch (err: any) {
        console.error('Failed to load forecast data:', err);
        setErrorMessage(
          err.message || 'Unable to fetch weather from Open-Meteo. Please check your connection.'
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  // Initial load or when location changes
  useEffect(() => {
    loadWeatherData(location);
  }, [location, loadWeatherData]);

  // Toggle unit system
  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  // Toggle favorite location
  const handleToggleFavorite = (target: GeoLocation) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) => f.name === target.name && Math.abs(f.latitude - target.latitude) < 0.1
      );
      if (exists) {
        return prev.filter(
          (f) => !(f.name === target.name && Math.abs(f.latitude - target.latitude) < 0.1)
        );
      }
      return [...prev, target];
    });
  };

  // Browser Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser environment.');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const resolved = await resolveLocationFromCoords(
            pos.coords.latitude,
            pos.coords.longitude
          );
          setLocation(resolved);
        } catch (err) {
          console.error(err);
          setErrorMessage('Unable to determine location name from coordinates.');
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (err) => {
        console.warn('Geolocation permission error or timeout:', err);
        setIsLoadingLocation(false);
        setErrorMessage('Location access denied or unavailable. You can search your city above.');
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  // Manual refresh
  const handleRefresh = () => {
    loadWeatherData(location, true);
  };

  // Derived intelligence calculations
  const activities =
    forecast && forecast.current
      ? calculateActivityScores(forecast.current, forecast.hourly)
      : [];
  const outfit =
    forecast && forecast.current && forecast.daily
      ? generateOutfitAdvisor(forecast.current, forecast.daily)
      : null;
  const insights =
    forecast && forecast.daily ? analyzeWeeklyOutlook(forecast.daily) : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Top Bar Contract (Wordmark - Navigation - Action Buttons) */}
      <Header
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onUseCurrentLocation={handleUseCurrentLocation}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        isLoadingLocation={isLoadingLocation}
      />

      {/* Main Content Workspace (Max width 1440px desktop presence) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* City Search & Quick Presets Row */}
        <section className="w-full">
          <CitySearch
            currentCity={location}
            onSelectCity={(newCity) => setLocation(newCity)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        </section>

        {/* Error Notification Banner if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => loadWeatherData(location)}
              className="px-3 py-1 bg-rose-900/60 hover:bg-rose-900 rounded-lg text-rose-100 font-medium transition-colors shrink-0"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && !forecast && (
          <div className="space-y-6 animate-pulse">
            <div className="h-64 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-mono">
                <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                <span>Fetching meteorological models from Open-Meteo...</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-slate-900/60 border border-slate-800" />
              ))}
            </div>
          </div>
        )}

        {/* Populated Weather Dashboard */}
        {forecast && forecast.current && forecast.daily && (
          <div className="space-y-6">
            {/* Section 1: Current Weather Hero (Focal Anchor) */}
            <CurrentWeatherHero
              location={location}
              current={forecast.current}
              daily={forecast.daily}
              unit={unit}
            />

            {/* Section 2: Key Weather Metrics Grid */}
            <WeatherMetricsGrid
              current={forecast.current}
              daily={forecast.daily}
              unit={unit}
            />

            {/* Section 3: Hourly Trajectory Reel & Trend Curve */}
            {forecast.hourly && (
              <HourlyForecastReel hourly={forecast.hourly} unit={unit} />
            )}

            {/* Section 4: 7-Day Forecast & Thermal Spectrum */}
            <DailyForecastList daily={forecast.daily} unit={unit} />

            {/* Section 5: Planning Intelligence & Smart Wardrobe Advisor */}
            {outfit && (
              <PlanningIntelligence
                activities={activities}
                outfit={outfit}
                insights={insights}
              />
            )}
          </div>
        )}
      </main>

      {/* Clean Unboxed Footer with Open-Meteo Attribution */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-300">Aura Weather Intelligence</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Local conditions & 7-day planning</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <span>Data provided by</span>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
            >
              Open-Meteo Free Weather API
            </a>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Non-commercial open data</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
