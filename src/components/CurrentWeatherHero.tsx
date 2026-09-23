import React from 'react';
import { MapPin, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { CurrentWeatherData, DailyWeatherData, GeoLocation, UnitSystem } from '../types/weather.ts';
import { getWeatherCondition } from '../utils/weatherCodes.ts';
import { formatTemp, formatWindSpeed, getUVRating } from '../utils/units.ts';
import { WeatherIcon } from './WeatherIcon.tsx';

interface CurrentWeatherHeroProps {
  location: GeoLocation;
  current: CurrentWeatherData;
  daily: DailyWeatherData;
  unit: UnitSystem;
}

export const CurrentWeatherHero: React.FC<CurrentWeatherHeroProps> = ({
  location,
  current,
  daily,
  unit,
}) => {
  const isDay = current.is_day === 1;
  const condition = getWeatherCondition(current.weather_code, isDay);
  const uvInfo = getUVRating(current.uv_index);

  // Today's High and Low from daily data
  const todayHigh = daily.temperature_2m_max?.[0];
  const todayLow = daily.temperature_2m_min?.[0];

  // Format local time using city's timezone
  const getCityLocalTime = () => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        timeZone: location.timezone !== 'auto' ? location.timezone : undefined,
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(new Date());
    } catch (e) {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div
      id="current-weather"
      className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br ${condition.theme.bgGradient} p-6 sm:p-8 shadow-xl transition-all duration-300`}
    >
      {/* Subtle atmospheric glow effect */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: condition.theme.accentColor }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left: Location & Time details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{location.name}</span>
            </span>
            {location.admin1 && (
              <>
                <span className="text-slate-600">/</span>
                <span className="text-slate-300">{location.admin1}</span>
              </>
            )}
            {location.country && (
              <>
                <span className="text-slate-600">/</span>
                <span className="text-slate-200 font-semibold">{location.country}</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {location.name}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{getCityLocalTime()}</span>
              {location.timezone && location.timezone !== 'auto' && (
                <span className="text-slate-400">({location.timezone.split('/')[1]?.replace('_', ' ') || location.timezone})</span>
              )}
            </div>
          </div>

          {/* Condition Description & Unboxed metadata */}
          <div className="flex items-center gap-3 pt-1 text-xs text-slate-300">
            <span className="font-medium text-slate-200">{condition.label}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400 font-mono tabular-nums">
              Feels like {formatTemp(current.apparent_temperature, unit)}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400 font-mono tabular-nums">
              Wind {formatWindSpeed(current.wind_speed_10m, unit)}
            </span>
          </div>

          <p className="text-sm text-slate-300/90 max-w-lg leading-relaxed pt-1">
            {condition.description}
          </p>
        </div>

        {/* Right: Primary Hero Temperature & Condition Icon */}
        <div className="flex items-center gap-6 self-start md:self-center shrink-0">
          <div className="flex flex-col items-end">
            <div className="text-6xl sm:text-7xl font-extralight tracking-tighter text-white font-mono tabular-nums">
              {formatTemp(current.temperature_2m, unit)}
            </div>

            {/* High / Low Range */}
            <div className="flex items-center gap-3 text-xs font-mono text-slate-300 mt-1">
              <span className="flex items-center text-amber-300">
                <ArrowUp className="w-3 h-3 mr-0.5 text-amber-400" />
                <span>{formatTemp(todayHigh, unit)}</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center text-sky-300">
                <ArrowDown className="w-3 h-3 mr-0.5 text-sky-400" />
                <span>{formatTemp(todayLow, unit)}</span>
              </span>
            </div>
          </div>

          {/* Large Condition Icon */}
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center p-3 border shadow-inner transition-transform hover:scale-105 duration-200"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              color: condition.theme.accentColor,
            }}
          >
            <WeatherIcon name={condition.iconName} className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
        </div>
      </div>

      {/* Hero Footnote: Unboxed summary indicators */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400">
          <span>Humidity: <strong className="text-slate-200 font-mono tabular-nums">{current.relative_humidity_2m}%</strong></span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>UV Index: <strong className={`${uvInfo.color} font-mono tabular-nums`}>{current.uv_index.toFixed(1)} ({uvInfo.label})</strong></span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>Precipitation: <strong className="text-slate-200 font-mono tabular-nums">{current.precipitation.toFixed(1)} mm</strong></span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>Cloud Cover: <strong className="text-slate-200 font-mono tabular-nums">{current.cloud_cover}%</strong></span>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          Lat: {location.latitude.toFixed(2)}° · Lon: {location.longitude.toFixed(2)}°
        </div>
      </div>
    </div>
  );
};
