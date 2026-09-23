import { UnitSystem } from '../types/weather.ts';

export function formatTemp(celsius: number | undefined | null, unit: UnitSystem = 'metric'): string {
  if (celsius === undefined || celsius === null || isNaN(celsius)) return '--';
  if (unit === 'imperial') {
    const f = Math.round((celsius * 9) / 5 + 32);
    return `${f}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatTempNumber(celsius: number | undefined | null, unit: UnitSystem = 'metric'): number {
  if (celsius === undefined || celsius === null || isNaN(celsius)) return 0;
  if (unit === 'imperial') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function tempUnitSymbol(unit: UnitSystem = 'metric'): string {
  return unit === 'imperial' ? '°F' : '°C';
}

export function formatWindSpeed(kmh: number | undefined | null, unit: UnitSystem = 'metric'): string {
  if (kmh === undefined || kmh === null || isNaN(kmh)) return '--';
  if (unit === 'imperial') {
    const mph = (kmh * 0.621371).toFixed(1);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatPrecipitation(mm: number | undefined | null, unit: UnitSystem = 'metric'): string {
  if (mm === undefined || mm === null || isNaN(mm)) return '--';
  if (unit === 'imperial') {
    const inches = (mm * 0.0393701).toFixed(2);
    return `${inches} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

export function formatPressure(hpa: number | undefined | null, unit: UnitSystem = 'metric'): string {
  if (hpa === undefined || hpa === null || isNaN(hpa)) return '--';
  if (unit === 'imperial') {
    const inHg = (hpa * 0.02953).toFixed(2);
    return `${inHg} inHg`;
  }
  return `${Math.round(hpa)} hPa`;
}

export function getWindDirectionCompass(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

export function getUVRating(uv: number): { label: string; color: string; desc: string } {
  if (uv < 3) return { label: 'Low', color: 'text-emerald-400', desc: 'Minimal sun protection needed' };
  if (uv < 6) return { label: 'Moderate', color: 'text-amber-300', desc: 'Wear SPF 30+ and sunglasses' };
  if (uv < 8) return { label: 'High', color: 'text-orange-400', desc: 'Seek shade during midday peak' };
  if (uv < 11) return { label: 'Very High', color: 'text-rose-400', desc: 'High risk: protect skin & eyes' };
  return { label: 'Extreme', color: 'text-purple-400', desc: 'Avoid outdoor sun exposure' };
}
