import React, { useState } from 'react';
import { Clock, Droplets, Wind, Thermometer } from 'lucide-react';
import { HourlyWeatherData, UnitSystem } from '../types/weather.ts';
import { getWeatherCondition } from '../utils/weatherCodes.ts';
import { formatTemp, formatWindSpeed } from '../utils/units.ts';
import { WeatherIcon } from './WeatherIcon.tsx';

interface HourlyForecastReelProps {
  hourly: HourlyWeatherData;
  unit: UnitSystem;
}

type MetricMode = 'temperature' | 'precipitation' | 'wind';

export const HourlyForecastReel: React.FC<HourlyForecastReelProps> = ({
  hourly,
  unit,
}) => {
  const [metricMode, setMetricMode] = useState<MetricMode>('temperature');

  // Take next 24 hourly periods starting from current time
  const now = new Date();
  const currentIsoPrefix = now.toISOString().slice(0, 13); // "YYYY-MM-DDTHH"

  // Find index closest to now
  let startIndex = 0;
  if (hourly && hourly.time) {
    const idx = hourly.time.findIndex((t) => t.startsWith(currentIsoPrefix));
    if (idx !== -1) startIndex = idx;
  }

  const hoursToShow = 24;
  const hoursData = Array.from({ length: hoursToShow }, (_, i) => {
    const index = startIndex + i;
    if (!hourly || !hourly.time || index >= hourly.time.length) return null;

    const timeStr = hourly.time[index];
    const date = new Date(timeStr);
    const hourNum = date.getHours();
    const isNow = i === 0;

    return {
      index,
      timeStr,
      displayTime: isNow ? 'Now' : `${hourNum.toString().padStart(2, '0')}:00`,
      temp: hourly.temperature_2m[index],
      feelsLike: hourly.apparent_temperature[index],
      precipProb: hourly.precipitation_probability[index] || 0,
      precipMm: hourly.precipitation[index] || 0,
      weatherCode: hourly.weather_code[index],
      windSpeed: hourly.wind_speed_10m[index],
      isDay: hourNum >= 6 && hourNum < 20,
    };
  }).filter(Boolean) as Array<{
    index: number;
    timeStr: string;
    displayTime: string;
    temp: number;
    feelsLike: number;
    precipProb: number;
    precipMm: number;
    weatherCode: number;
    windSpeed: number;
    isDay: boolean;
  }>;

  if (hoursData.length === 0) return null;

  // Compute SVG graph metrics for the selected mode
  const svgWidth = 800;
  const svgHeight = 120;
  const paddingX = 20;
  const paddingY = 24;

  let values: number[] = [];
  if (metricMode === 'temperature') {
    values = hoursData.map((d) => d.temp);
  } else if (metricMode === 'precipitation') {
    values = hoursData.map((d) => d.precipProb);
  } else {
    values = hoursData.map((d) => d.windSpeed);
  }

  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal > 0 ? maxVal - minVal : 1;

  const points = hoursData.map((d, i) => {
    const x = paddingX + (i / (hoursData.length - 1)) * (svgWidth - paddingX * 2);
    const y =
      svgHeight -
      paddingY -
      ((values[i] - minVal) / range) * (svgHeight - paddingY * 2);
    return { x, y, val: values[i], ...d };
  });

  // Build SVG path
  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx1 = (prev.x + curr.x) / 2;
      const cy1 = prev.y;
      const cx2 = (prev.x + curr.x) / 2;
      const cy2 = curr.y;
      pathD += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
    }
  }

  const areaD = pathD
    ? `${pathD} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`
    : '';

  const getThemeStroke = () => {
    switch (metricMode) {
      case 'temperature':
        return '#38bdf8'; // sky cyan
      case 'precipitation':
        return '#60a5fa'; // blue
      case 'wind':
        return '#34d399'; // emerald
    }
  };

  return (
    <div
      id="hourly-forecast"
      className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5"
    >
      {/* Header and Interactive Metric Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h2 className="text-base font-semibold text-white tracking-tight">
            Hourly Trajectory (Next 24 Hours)
          </h2>
        </div>

        {/* Functional filter tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800/80 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setMetricMode('temperature')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              metricMode === 'temperature'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temp</span>
          </button>

          <button
            onClick={() => setMetricMode('precipitation')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              metricMode === 'precipitation'
                ? 'bg-slate-800 text-blue-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Rain Risk</span>
          </button>

          <button
            onClick={() => setMetricMode('wind')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              metricMode === 'wind'
                ? 'bg-slate-800 text-emerald-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind</span>
          </button>
        </div>
      </div>

      {/* Interactive Trend SVG Curve */}
      <div className="w-full bg-slate-950/50 border border-slate-800/60 rounded-xl p-3 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[680px]">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-28 overflow-visible"
            >
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={getThemeStroke()} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={getThemeStroke()} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              {areaD && <path d={areaD} fill="url(#curveGradient)" />}

              {/* Line curve */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke={getThemeStroke()}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}

              {/* Key hourly data points */}
              {points.map((pt, i) => {
                const showLabel = i % 3 === 0 || i === points.length - 1;
                return (
                  <g key={`pt-${i}`}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="3.5"
                      fill="#0f172a"
                      stroke={getThemeStroke()}
                      strokeWidth="2"
                    />
                    {showLabel && (
                      <text
                        x={pt.x}
                        y={pt.y - 8}
                        textAnchor="middle"
                        fill="#cbd5e1"
                        fontSize="11"
                        fontFamily="JetBrains Mono, monospace"
                        className="tabular-nums"
                      >
                        {metricMode === 'temperature'
                          ? formatTemp(pt.temp, unit)
                          : metricMode === 'precipitation'
                          ? `${Math.round(pt.precipProb)}%`
                          : formatWindSpeed(pt.windSpeed, unit)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Horizontal Hourly Cards Carousel */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
        {hoursData.map((hour) => {
          const condition = getWeatherCondition(hour.weatherCode, hour.isDay);

          return (
            <div
              key={hour.timeStr}
              className={`shrink-0 w-24 p-3 rounded-xl border flex flex-col items-center justify-between gap-2.5 transition-all duration-150 ${
                hour.displayTime === 'Now'
                  ? 'bg-cyan-500/10 border-cyan-500/30 shadow-md'
                  : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
              }`}
            >
              <div
                className={`text-xs font-mono font-medium ${
                  hour.displayTime === 'Now' ? 'text-cyan-300' : 'text-slate-400'
                }`}
              >
                {hour.displayTime}
              </div>

              {/* Weather icon */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ color: condition.theme.accentColor }}
                title={`${condition.label} (${hour.temp}°C)`}
              >
                <WeatherIcon name={condition.iconName} className="w-5 h-5" />
              </div>

              {/* Primary metric display */}
              <div className="text-sm font-semibold font-mono text-white tabular-nums">
                {metricMode === 'temperature' && formatTemp(hour.temp, unit)}
                {metricMode === 'precipitation' && `${Math.round(hour.precipProb)}%`}
                {metricMode === 'wind' && formatWindSpeed(hour.windSpeed, unit)}
              </div>

              {/* Rain likelihood mini-indicator */}
              <div className="w-full flex items-center justify-center gap-1 text-[11px] text-slate-400 font-mono">
                <Droplets
                  className={`w-3 h-3 ${
                    hour.precipProb > 30 ? 'text-sky-400' : 'text-slate-400'
                  }`}
                />
                <span className={hour.precipProb > 30 ? 'text-sky-300 font-medium' : ''}>
                  {Math.round(hour.precipProb)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
