import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Droplets, Wind, Sun, Compass } from 'lucide-react';
import { DailyWeatherData, UnitSystem } from '../types/weather.ts';
import { getWeatherCondition } from '../utils/weatherCodes.ts';
import { formatTemp, formatWindSpeed, getUVRating } from '../utils/units.ts';
import { WeatherIcon } from './WeatherIcon.tsx';

interface DailyForecastListProps {
  daily: DailyWeatherData;
  unit: UnitSystem;
}

export const DailyForecastList: React.FC<DailyForecastListProps> = ({ daily, unit }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (!daily || !daily.time || daily.time.length === 0) return null;

  // Compute absolute 7-day thermal spectrum
  const overallMin = Math.min(...daily.temperature_2m_min);
  const overallMax = Math.max(...daily.temperature_2m_max);
  const tempSpread = overallMax - overallMin > 0 ? overallMax - overallMin : 1;

  const daysCount = Math.min(7, daily.time.length);
  const daysData = Array.from({ length: daysCount }, (_, i) => {
    const dateStr = daily.time[i];
    const date = new Date(dateStr);
    const isToday = i === 0;
    const isTomorrow = i === 1;

    let dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
    if (isToday) dayName = 'Today';
    else if (isTomorrow) dayName = 'Tomorrow';

    const formattedDate = date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });

    const minT = daily.temperature_2m_min[i];
    const maxT = daily.temperature_2m_max[i];
    const code = daily.weather_code[i];
    const precipProb = daily.precipitation_probability_max?.[i] || 0;
    const precipSum = daily.precipitation_sum?.[i] || 0;
    const windMax = daily.wind_speed_10m_max?.[i] || 0;
    const uvMax = daily.uv_index_max?.[i] || 0;
    const sunrise = daily.sunrise?.[i]
      ? new Date(daily.sunrise[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '--:--';
    const sunset = daily.sunset?.[i]
      ? new Date(daily.sunset[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '--:--';

    // Position of range bar relative to 7-day spectrum
    const leftPercent = Math.max(0, Math.min(90, ((minT - overallMin) / tempSpread) * 100));
    const widthPercent = Math.max(8, Math.min(100 - leftPercent, ((maxT - minT) / tempSpread) * 100));

    // Dynamic daily tip
    let dayTip = 'Typical seasonal conditions.';
    if (precipSum > 3) {
      dayTip = 'Noticeable rainfall expected; prioritize indoor activities and carry rain gear.';
    } else if (uvMax >= 7) {
      dayTip = 'Elevated UV index; apply SPF 30+ sunscreen and wear sunglasses outdoors.';
    } else if (windMax > 30) {
      dayTip = 'Breezy winds; secure loose outdoor patio items.';
    } else if (maxT > 24) {
      dayTip = 'Warm pleasant day; optimal for parks, running, and outdoor plans.';
    } else if (minT < 2) {
      dayTip = 'Frost potential during early morning hours; layer up with warm coat.';
    }

    return {
      index: i,
      dayName,
      formattedDate,
      minT,
      maxT,
      code,
      precipProb,
      precipSum,
      windMax,
      uvMax,
      sunrise,
      sunset,
      leftPercent,
      widthPercent,
      dayTip,
    };
  });

  return (
    <div id="daily-forecast" className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h2 className="text-base font-semibold text-white tracking-tight">
            7-Day Outlook & Thermal Spectrum
          </h2>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Weekly range: {formatTemp(overallMin, unit)} to {formatTemp(overallMax, unit)}
        </div>
      </div>

      {/* Daily rows */}
      <div className="divide-y divide-slate-800/80">
        {daysData.map((d) => {
          const condition = getWeatherCondition(d.code, true);
          const isExpanded = expandedIndex === d.index;
          const uvRating = getUVRating(d.uvMax);

          return (
            <div key={d.index} className="py-3 transition-colors">
              {/* Primary clickable summary row */}
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? null : d.index)}
                className="w-full text-left flex items-center justify-between gap-3 group focus:outline-none"
              >
                {/* Date & Condition */}
                <div className="w-32 sm:w-40 shrink-0 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ color: condition.theme.accentColor }}
                  >
                    <WeatherIcon name={condition.iconName} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                      <span>{d.dayName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{d.formattedDate}</div>
                  </div>
                </div>

                {/* Rain probability & Condition Label */}
                <div className="hidden sm:flex items-center gap-2 w-36 shrink-0">
                  <div className="text-xs text-slate-300 truncate">{condition.label}</div>
                  {d.precipProb > 15 && (
                    <div className="flex items-center gap-0.5 text-xs text-sky-400 font-mono tabular-nums shrink-0">
                      <Droplets className="w-3 h-3" />
                      <span>{Math.round(d.precipProb)}%</span>
                    </div>
                  )}
                </div>

                {/* Thermal Range Bar */}
                <div className="flex-1 flex items-center gap-3 max-w-xs sm:max-w-md">
                  <span className="text-xs font-mono font-medium text-slate-400 w-10 text-right tabular-nums">
                    {formatTemp(d.minT, unit)}
                  </span>

                  {/* Relative bar track */}
                  <div className="relative flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-teal-300 to-amber-400"
                      style={{
                        left: `${d.leftPercent}%`,
                        width: `${d.widthPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-mono font-semibold text-white w-10 text-left tabular-nums">
                    {formatTemp(d.maxT, unit)}
                  </span>
                </div>

                {/* Expand chevron */}
                <div className="text-slate-400 group-hover:text-slate-200 pl-2 shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Expandable Daily Intelligence Panel */}
              {isExpanded && (
                <div className="mt-3 p-3.5 bg-slate-950/70 border border-slate-800/90 rounded-xl space-y-3 text-xs text-slate-300 animate-in fade-in-50 duration-200">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/60 pb-2">
                    <span className="font-medium text-slate-200">{condition.description}</span>
                    <span className="font-mono text-cyan-400">{d.dayTip}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-3.5 h-3.5 text-blue-400" />
                      <div>
                        <div className="text-[10px] uppercase text-slate-400">Precipitation</div>
                        <div className="text-slate-100 font-semibold tabular-nums">
                          {d.precipSum.toFixed(1)} mm ({Math.round(d.precipProb)}%)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Wind className="w-3.5 h-3.5 text-emerald-400" />
                      <div>
                        <div className="text-[10px] uppercase text-slate-400">Peak Wind</div>
                        <div className="text-slate-100 font-semibold tabular-nums">
                          {formatWindSpeed(d.windMax, unit)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <div>
                        <div className="text-[10px] uppercase text-slate-400">Max UV Index</div>
                        <div className={`font-semibold tabular-nums ${uvRating.color}`}>
                          {d.uvMax.toFixed(1)} ({uvRating.label})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5 text-orange-400" />
                      <div>
                        <div className="text-[10px] uppercase text-slate-400">Sun Hours</div>
                        <div className="text-slate-100 font-semibold tabular-nums">
                          {d.sunrise} – {d.sunset}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
