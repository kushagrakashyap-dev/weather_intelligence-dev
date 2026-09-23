import React from 'react';
import { MapPin, RefreshCw, Compass } from 'lucide-react';
import { UnitSystem } from '../types/weather.ts';

interface HeaderProps {
  unit: UnitSystem;
  onToggleUnit: () => void;
  onUseCurrentLocation: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  isLoadingLocation?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onUseCurrentLocation,
  onRefresh,
  isRefreshing = false,
  isLoadingLocation = false,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Compass className="w-4 h-4 animate-[spin_24s_linear_infinite]" />
          </div>
          <a
            href="/"
            className="text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors"
          >
            Aura Weather
          </a>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <a href="#current-weather" className="hover:text-cyan-300 transition-colors">
            Current
          </a>
          <a href="#hourly-forecast" className="hover:text-cyan-300 transition-colors">
            Hourly
          </a>
          <a href="#daily-forecast" className="hover:text-cyan-300 transition-colors">
            7-Day Outlook
          </a>
          <a href="#activity-planner" className="hover:text-cyan-300 transition-colors">
            Activity Planner
          </a>
          <a href="#outfit-advisor" className="hover:text-cyan-300 transition-colors">
            Wardrobe Guide
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Unit Toggle Button */}
          <button
            onClick={onToggleUnit}
            title={`Switch to ${unit === 'metric' ? 'Imperial (°F, mph)' : 'Metric (°C, km/h)'}`}
            className="px-2.5 py-1.5 text-xs font-mono font-medium text-slate-300 bg-slate-900 border border-slate-700/80 rounded-lg hover:border-cyan-500/50 hover:text-white transition-all flex items-center gap-1.5"
          >
            <span className={unit === 'metric' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}>
              °C
            </span>
            <span className="text-slate-600">/</span>
            <span className={unit === 'imperial' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}>
              °F
            </span>
          </button>

          {/* Current Location button */}
          <button
            onClick={onUseCurrentLocation}
            disabled={isLoadingLocation}
            title="Locate my position"
            className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <MapPin className={`w-3.5 h-3.5 text-cyan-400 ${isLoadingLocation ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">My Location</span>
          </button>

          {/* Refresh data button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh forecast data"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
