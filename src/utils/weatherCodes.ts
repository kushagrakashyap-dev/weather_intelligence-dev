import { WeatherConditionInfo } from '../types/weather.ts';

export function getWeatherCondition(code: number, isDay: boolean = true): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? 'Clear Sky' : 'Clear Night',
        description: isDay ? 'Bright sunshine and cloudless skies.' : 'Clear starry skies with excellent visibility.',
        iconName: isDay ? 'Sun' : 'Moon',
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        theme: {
          bgGradient: isDay
            ? 'from-sky-900/60 via-slate-900/80 to-slate-950'
            : 'from-indigo-950/70 via-slate-900/90 to-slate-950',
          accentColor: isDay ? '#38bdf8' : '#818cf8',
          tagBg: isDay ? 'bg-sky-500/10' : 'bg-indigo-500/10',
          tagText: isDay ? 'text-sky-300' : 'text-indigo-300',
        },
      };

    case 1:
      return {
        code,
        label: isDay ? 'Mainly Clear' : 'Mostly Clear',
        description: 'Mostly clear conditions with isolated wisps of cloud.',
        iconName: isDay ? 'SunMedium' : 'MoonStar',
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        theme: {
          bgGradient: isDay
            ? 'from-cyan-900/50 via-slate-900/80 to-slate-950'
            : 'from-slate-900/70 via-slate-900/90 to-slate-950',
          accentColor: '#38bdf8',
          tagBg: 'bg-cyan-500/10',
          tagText: 'text-cyan-300',
        },
      };

    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        description: 'Scattered clouds with periods of clear sky.',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        theme: {
          bgGradient: 'from-blue-900/40 via-slate-900/80 to-slate-950',
          accentColor: '#60a5fa',
          tagBg: 'bg-blue-500/10',
          tagText: 'text-blue-300',
        },
      };

    case 3:
      return {
        code,
        label: 'Overcast',
        description: 'Thick, continuous cloud layer blocking direct sunlight.',
        iconName: 'Cloud',
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        theme: {
          bgGradient: 'from-slate-800/60 via-slate-900/90 to-slate-950',
          accentColor: '#94a3b8',
          tagBg: 'bg-slate-500/10',
          tagText: 'text-slate-300',
        },
      };

    case 45:
    case 48:
      return {
        code,
        label: code === 48 ? 'Depositing Rime Fog' : 'Dense Fog',
        description: 'Low-lying moisture causing significantly reduced visibility.',
        iconName: 'CloudFog',
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        theme: {
          bgGradient: 'from-teal-950/60 via-slate-900/90 to-slate-950',
          accentColor: '#2dd4bf',
          tagBg: 'bg-teal-500/10',
          tagText: 'text-teal-300',
        },
      };

    case 51:
    case 53:
    case 55:
      return {
        code,
        label: code === 51 ? 'Light Drizzle' : code === 53 ? 'Moderate Drizzle' : 'Dense Drizzle',
        description: 'Fine misty precipitation; damp ground and high humidity.',
        iconName: 'CloudDrizzle',
        isRainy: true,
        isSnowy: false,
        isStormy: false,
        theme: {
          bgGradient: 'from-cyan-950/70 via-slate-900/90 to-slate-950',
          accentColor: '#06b6d4',
          tagBg: 'bg-cyan-500/10',
          tagText: 'text-cyan-300',
        },
      };

    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        description: 'Supercooled drizzle that freezes upon contact with sub-zero surfaces.',
        iconName: 'CloudHail',
        isRainy: true,
        isSnowy: true,
        isStormy: false,
        theme: {
          bgGradient: 'from-sky-950/70 via-slate-900/90 to-slate-950',
          accentColor: '#38bdf8',
          tagBg: 'bg-sky-500/10',
          tagText: 'text-sky-300',
        },
      };

    case 61:
      return {
        code,
        label: 'Slight Rain',
        description: 'Light, steady rain showers. Umbrella recommended.',
        iconName: 'CloudRain',
        isRainy: true,
        isSnowy: false,
        isStormy: false,
        theme: {
          bgGradient: 'from-blue-950/70 via-slate-900/90 to-slate-950',
          accentColor: '#3b82f6',
          tagBg: 'bg-blue-500/10',
          tagText: 'text-blue-300',
        },
      };

    case 63:
      return {
        code,
        label: 'Moderate Rain',
        description: 'Continuous rainfall. Wet roads and noticeable accumulation.',
        iconName: 'CloudRain',
        isRainy: true,
        isSnowy: false,
        isStormy: false,
        theme: {
          bgGradient: 'from-blue-950/80 via-slate-900/90 to-slate-950',
          accentColor: '#60a5fa',
          tagBg: 'bg-blue-500/10',
          tagText: 'text-blue-300',
        },
      };

    case 65:
      return {
        code,
        label: 'Heavy Rain',
        description: 'Intense precipitation with potential surface runoff and pooling.',
        iconName: 'CloudRainWind',
        isRainy: true,
        isSnowy: false,
        isStormy: false,
        theme: {
          bgGradient: 'from-indigo-950/85 via-slate-900/95 to-slate-950',
          accentColor: '#818cf8',
          tagBg: 'bg-indigo-500/10',
          tagText: 'text-indigo-300',
        },
      };

    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        description: 'Raindrops freezing on contact, creating hazardous icy coatings.',
        iconName: 'CloudHail',
        isRainy: true,
        isSnowy: true,
        isStormy: false,
        theme: {
          bgGradient: 'from-slate-900/90 via-sky-950/80 to-slate-950',
          accentColor: '#7dd3fc',
          tagBg: 'bg-sky-500/10',
          tagText: 'text-sky-300',
        },
      };

    case 71:
    case 73:
    case 75:
      return {
        code,
        label: code === 71 ? 'Light Snow' : code === 73 ? 'Moderate Snow' : 'Heavy Snowfall',
        description: 'Snow flurries accumulating on surfaces; cold conditions.',
        iconName: 'CloudSnow',
        isRainy: false,
        isSnowy: true,
        isStormy: false,
        theme: {
          bgGradient: 'from-slate-800/70 via-slate-900/90 to-slate-950',
          accentColor: '#e2e8f0',
          tagBg: 'bg-slate-500/10',
          tagText: 'text-slate-200',
        },
      };

    case 77:
      return {
        code,
        label: 'Snow Grains',
        description: 'Tiny, opaque ice grains falling from stratiform clouds.',
        iconName: 'CloudSnow',
        isRainy: false,
        isSnowy: true,
        isStormy: false,
        theme: {
          bgGradient: 'from-slate-800/70 via-slate-900/90 to-slate-950',
          accentColor: '#cbd5e1',
          tagBg: 'bg-slate-500/10',
          tagText: 'text-slate-200',
        },
      };

    case 80:
    case 81:
    case 82:
      return {
        code,
        label: code === 82 ? 'Violent Rain Showers' : code === 81 ? 'Moderate Showers' : 'Passing Showers',
        description: 'Intermittent bursts of rain followed by possible partial breaks.',
        iconName: 'CloudRain',
        isRainy: true,
        isSnowy: false,
        isStormy: false,
        theme: {
          bgGradient: 'from-blue-950/80 via-slate-900/90 to-slate-950',
          accentColor: '#38bdf8',
          tagBg: 'bg-blue-500/10',
          tagText: 'text-blue-300',
        },
      };

    case 85:
    case 86:
      return {
        code,
        label: code === 86 ? 'Heavy Snow Showers' : 'Snow Showers',
        description: 'Sudden snow showers with rapid shifts in visibility.',
        iconName: 'CloudSnow',
        isRainy: false,
        isSnowy: true,
        isStormy: false,
        theme: {
          bgGradient: 'from-slate-900/80 via-blue-950/60 to-slate-950',
          accentColor: '#bae6fd',
          tagBg: 'bg-sky-500/10',
          tagText: 'text-sky-300',
        },
      };

    case 95:
      return {
        code,
        label: 'Thunderstorm',
        description: 'Convective storm activity with lightning flashes and thunder rolls.',
        iconName: 'CloudLightning',
        isRainy: true,
        isSnowy: false,
        isStormy: true,
        theme: {
          bgGradient: 'from-amber-950/60 via-slate-900/95 to-slate-950',
          accentColor: '#fbbf24',
          tagBg: 'bg-amber-500/10',
          tagText: 'text-amber-300',
        },
      };

    case 96:
    case 99:
      return {
        code,
        label: code === 99 ? 'Thunderstorm with Severe Hail' : 'Thunderstorm with Hail',
        description: 'Severe electrical storm accompanied by solid ice hail stones.',
        iconName: 'CloudLightning',
        isRainy: true,
        isSnowy: false,
        isStormy: true,
        theme: {
          bgGradient: 'from-rose-950/70 via-slate-900/95 to-slate-950',
          accentColor: '#f43f5e',
          tagBg: 'bg-rose-500/10',
          tagText: 'text-rose-300',
        },
      };

    default:
      return {
        code,
        label: 'Variable Conditions',
        description: 'Typical regional conditions for this time of day.',
        iconName: 'SunCloud',
        isRainy: false,
        isSnowy: false,
        isStormy: false,
        theme: {
          bgGradient: 'from-slate-900/80 via-slate-900/90 to-slate-950',
          accentColor: '#94a3b8',
          tagBg: 'bg-slate-500/10',
          tagText: 'text-slate-300',
        },
      };
  }
}
