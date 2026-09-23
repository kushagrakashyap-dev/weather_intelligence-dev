import React from 'react';
import {
  Wind,
  Droplets,
  Sun,
  Gauge,
  Eye,
  Cloud,
  Sunrise,
  Sunset,
  Navigation,
} from 'lucide-react';
import { CurrentWeatherData, DailyWeatherData, UnitSystem } from '../types/weather.ts';
import {
  formatWindSpeed,
  formatPressure,
  getWindDirectionCompass,
  getUVRating,
} from '../utils/units.ts';

interface WeatherMetricsGridProps {
  current: CurrentWeatherData;
  daily: DailyWeatherData;
  unit: UnitSystem;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({
  current,
  daily,
  unit,
}) => {
  const uvInfo = getUVRating(current.uv_index);
  const windCompass = getWindDirectionCompass(current.wind_direction_10m);

  // Sunrise and Sunset for today
  const sunriseStr = daily.sunrise?.[0]
    ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';
  const sunsetStr = daily.sunset?.[0]
    ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  // Compute daylight duration in hours and minutes
  let daylightDuration = '';
  if (daily.sunrise?.[0] && daily.sunset?.[0]) {
    const riseMs = new Date(daily.sunrise[0]).getTime();
    const setMs = new Date(daily.sunset[0]).getTime();
    if (setMs > riseMs) {
      const diffMins = Math.round((setMs - riseMs) / (1000 * 60));
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      daylightDuration = `${hours}h ${mins}m daylight`;
    }
  }

  // Dew point approximation: T - ((100 - RH) / 5)
  const approxDewPoint = Math.round(
    current.temperature_2m - (100 - current.relative_humidity_2m) / 5
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Wind & Gusts */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Wind className="w-4 h-4 text-cyan-400" />
            Wind & Flow
          </span>
          <span className="font-mono text-slate-400">{windCompass}</span>
        </div>

        <div className="my-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
            {formatWindSpeed(current.wind_speed_10m, unit)}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <Navigation
              className="w-3 h-3 text-cyan-400"
              style={{ transform: `rotate(${current.wind_direction_10m}deg)` }}
            />
            <span>Gusts up to {formatWindSpeed(current.wind_gusts_10m, unit)}</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          Direction: {current.wind_direction_10m}°
        </div>
      </div>

      {/* 2. Humidity & Dew Point */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Droplets className="w-4 h-4 text-sky-400" />
            Humidity
          </span>
          <span className="font-mono text-slate-400">RH</span>
        </div>

        <div className="my-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
            {current.relative_humidity_2m}%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Dew point approx {approxDewPoint}°C
          </div>
        </div>

        {/* Humidity comfort progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-sky-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(5, current.relative_humidity_2m))}%` }}
          />
        </div>
      </div>

      {/* 3. UV Index */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Sun className="w-4 h-4 text-amber-400" />
            UV Radiation
          </span>
          <span className={`font-medium ${uvInfo.color}`}>{uvInfo.label}</span>
        </div>

        <div className="my-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
            {current.uv_index.toFixed(1)}
            <span className="text-xs font-normal text-slate-400 ml-1.5">/ 11+</span>
          </div>
          <div className="text-xs text-slate-400 mt-1 truncate" title={uvInfo.desc}>
            {uvInfo.desc}
          </div>
        </div>

        {/* UV scale bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500"
            style={{ width: `${Math.min(100, Math.max(5, (current.uv_index / 11) * 100))}%` }}
          />
        </div>
      </div>

      {/* 4. Atmospheric Pressure */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Gauge className="w-4 h-4 text-emerald-400" />
            Air Pressure
          </span>
          <span className="font-mono text-slate-400">MSL</span>
        </div>

        <div className="my-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
            {formatPressure(current.pressure_msl, unit)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Surface: {formatPressure(current.surface_pressure, unit)}
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          {current.pressure_msl >= 1013 ? 'High pressure system (stable)' : 'Low pressure (active front)'}
        </div>
      </div>

      {/* 5. Cloud Cover */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Cloud className="w-4 h-4 text-indigo-400" />
            Cloud Cover
          </span>
          <span className="font-mono text-slate-400">{current.cloud_cover}%</span>
        </div>

        <div className="my-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
            {current.cloud_cover}%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {current.cloud_cover < 20
              ? 'Clear skies'
              : current.cloud_cover < 60
              ? 'Scattered clouds'
              : 'Dense overcast'}
          </div>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-indigo-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(5, current.cloud_cover)}%` }}
          />
        </div>
      </div>

      {/* 6. Precipitation & Rain */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Droplets className="w-4 h-4 text-blue-400" />
            Precipitation
          </span>
          <span className="font-mono text-slate-400">1h rate</span>
        </div>

        <div className="my-2">
          <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
            {current.precipitation.toFixed(1)}
            <span className="text-xs font-normal text-slate-400 ml-1">mm</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {current.snowfall > 0
              ? `Snowfall: ${current.snowfall.toFixed(1)} cm`
              : current.rain > 0
              ? `Rainfall: ${current.rain.toFixed(1)} mm`
              : 'Zero active precipitation'}
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          {current.precipitation > 0 ? 'Surface dampening' : 'Dry conditions'}
        </div>
      </div>

      {/* 7 & 8. Sunrise & Sunset Solar arc (Spans 2 columns on medium screens) */}
      <div className="col-span-2 p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium text-slate-300">Sun & Daylight Cycle</span>
          {daylightDuration && (
            <span className="font-mono text-cyan-400 text-xs">{daylightDuration}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 my-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sunrise className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-mono">Sunrise</div>
              <div className="text-lg font-bold font-mono text-white tabular-nums">{sunriseStr}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Sunset className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-mono">Sunset</div>
              <div className="text-lg font-bold font-mono text-white tabular-nums">{sunsetStr}</div>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-800/80">
          <span>Golden hour photography window: ~45 min before sunset</span>
          <span className="text-slate-400">Astronomical Solar Arc</span>
        </div>
      </div>
    </div>
  );
};
