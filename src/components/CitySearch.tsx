import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, Star, X } from 'lucide-react';
import { GeoLocation } from '../types/weather.ts';
import { searchCities, DEFAULT_CITIES } from '../services/openMeteo.ts';

interface CitySearchProps {
  currentCity: GeoLocation;
  onSelectCity: (city: GeoLocation) => void;
  favorites: GeoLocation[];
  onToggleFavorite: (city: GeoLocation) => void;
}

export const CitySearch: React.FC<CitySearchProps> = ({
  currentCity,
  onSelectCity,
  favorites,
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(async () => {
      try {
        const data = await searchCities(query);
        setResults(data);
        setSelectedIndex(-1);
      } catch (err) {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(handler);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: GeoLocation) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
    setResults([]);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const isCurrentFavorite = favorites.some((f) => f.name === currentCity.name && Math.abs(f.latitude - currentCity.latitude) < 0.1);

  return (
    <div className="w-full space-y-3" ref={containerRef}>
      {/* Search Input Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 pointer-events-none text-slate-400">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            ) : (
              <Search className="w-4 h-4 text-slate-400" />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search any global city or coordinates (e.g., Tokyo, Oslo, Kyoto, Melbourne)..."
            className="w-full pl-10 pr-24 py-2.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 focus:border-cyan-500/60 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all shadow-inner"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                  inputRef.current?.focus();
                }}
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Favorite toggle for current city */}
            <button
              type="button"
              onClick={() => onToggleFavorite(currentCity)}
              title={isCurrentFavorite ? 'Remove from saved locations' : 'Save location'}
              className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
                isCurrentFavorite
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isCurrentFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && results.length > 0 && (
          <div className="absolute top-full mt-1.5 w-full bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
            <div className="px-3 py-1.5 bg-slate-950/60 text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Open-Meteo Geocoding Results</span>
              <span>{results.length} found</span>
            </div>
            {results.map((city, idx) => (
              <button
                key={`${city.id}-${idx}`}
                type="button"
                onClick={() => handleSelect(city)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center justify-between gap-3 ${
                  selectedIndex === idx ? 'bg-cyan-500/15 text-white' : 'hover:bg-slate-800/60 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="truncate">
                    <div className="text-sm font-medium text-slate-100 truncate">
                      {city.name}
                      {city.admin1 && <span className="text-xs text-slate-400 font-normal ml-1.5">({city.admin1})</span>}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{city.country || 'Region'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                      </span>
                      {city.elevation !== undefined && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-[11px] text-slate-400">{Math.round(city.elevation)}m alt</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {city.population ? (
                  <div className="text-[11px] font-mono text-slate-400 shrink-0">
                    pop. {(city.population / 1000).toFixed(0)}k
                  </div>
                ) : null}
              </button>
            ))}
          </div>
        )}

        {isOpen && query.trim().length >= 2 && !isLoading && results.length === 0 && (
          <div className="absolute top-full mt-1.5 w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-center z-50 text-xs text-slate-400">
            No matching locations found for "{query}". Try checking the spelling or searching a major nearby city.
          </div>
        )}
      </div>

      {/* Quick City Presets & User Favorites */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-400 shrink-0 font-medium text-[11px]">Quick Jump:</span>

        {/* Favorite locations if any */}
        {favorites.map((fav) => (
          <button
            key={`fav-${fav.name}-${fav.latitude}`}
            onClick={() => onSelectCity(fav)}
            className={`shrink-0 px-2.5 py-1 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
              currentCity.name === fav.name
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-medium'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{fav.name}</span>
          </button>
        ))}

        {/* Preset global cities */}
        {DEFAULT_CITIES.map((city) => {
          const isActive = currentCity.name === city.name && Math.abs(currentCity.latitude - city.latitude) < 0.1;
          return (
            <button
              key={`preset-${city.name}`}
              onClick={() => onSelectCity(city)}
              className={`shrink-0 px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                isActive
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-medium'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
