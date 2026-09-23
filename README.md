# Weather Intelligence Report

A precision meteorological intelligence application and decision dashboard powered by **Open-Meteo**. The application allows users to search global cities, convert location names into exact geographical coordinates via the Open-Meteo Geocoding API, retrieve live weather metrics and 7-day predictive models via the Open-Meteo Forecast API, and receive context-aware outdoor and wardrobe recommendations.

---

## 🌟 Key Features

### 1. Global City Search & Geocoding
- **Open-Meteo Geocoding Integration**: Fast, query-debounced search converting any city, town, or municipality into coordinates (`latitude`, `longitude`, `elevation`).
- **Keyboard Navigation**: Full arrow-key selection (`Up`, `Down`, `Enter`, `Escape`) with population count and administrative hierarchy.
- **Bookmarks & Presets**: Save favorite locations to local storage, plus quick-jump access to major world hubs (Tokyo, London, New York, Paris, San Francisco, Sydney, Dubai).
- **One-Click Geolocation**: Detect current browser coordinates and reverse-geocode to nearest city name.

### 2. Live Current Conditions Hero
- **Real-Time Meteorology**: High-visibility temperature display with apparent "Feels Like" temperature, daily high/low boundaries, wind speed, and WMO weather condition code interpretation.
- **Atmospheric Visual State**: Dynamic gradient styling tailored to current conditions (Clear day/night, Overcast, Drizzle, Torrential Rain, Snow, Thunderstorm, Fog).
- **Timezone Awareness**: Displays current local solar time for the inspected city.

### 3. Key Metrics & Diagnostics Grid
- **Wind & Aerodynamics**: Wind velocity, gust peaks, exact directional compass angle, and directional arrow tracking.
- **Moisture & Comfort**: Relative humidity percentage and calculated dew point approximation.
- **Solar Radiation & UV Index**: UV index rating with protective guidance (Low, Moderate, High, Very High, Extreme).
- **Barometric Pressure**: Mean Sea Level (MSL) and Surface air pressure (hPa or inHg).
- **Precipitation & Cloudiness**: Instant 1-hour precipitation volume (rain/snowfall breakdown) and percentage cloud cover.
- **Solar Arc & Daylight**: Exact sunrise, sunset, daylight duration, and photography golden hour window.

### 4. Hourly Forecast & Trajectory Reel (24-Hour Outlook)
- **Interactive Trajectory Curve**: Smooth SVG curve graph displaying continuous trends across the upcoming 24 hours.
- **Metric Mode Selector**: Switch the graph and cards between:
  - **Temperature**: Continuous thermal trendline.
  - **Rain Risk**: Hourly precipitation likelihood percentages.
  - **Wind Speed**: Wind velocity shifts over time.
- **Hourly Carousel**: Quick-scroll card reel with hourly condition icons and rain likelihood badges.

### 5. 7-Day Forecast & Thermal Spectrum
- **Full Weekly Model**: Daily weather code interpretation, weather description, and maximum precipitation probabilities.
- **Relative Thermal Range Bar**: Visualizes where each day's low and high temperatures fall relative to the weekly thermal extremes.
- **Expandable Day Panels**: Detailed breakdown for each day including total precipitation accumulation (mm), peak wind velocity, peak UV index, sun hours, and curated daily planning tips.

### 6. Weather Intelligence & Planning Engine
- **Activity Suitability Index**: Evaluates meteorological factors to score suitability (0–100%) and rate conditions (`Optimal`, `Good`, `Fair`, `Poor`) across:
  - **Running & Cardio**: Thermal comfort, air resistance, and surface wetness.
  - **Cycling & Commuting**: Crosswinds, gust stability, and slick roads.
  - **Patio & Outdoor Dining**: Ambient temperature, precipitation risk, and airflow.
  - **Line Drying Laundry**: Evaporation rate based on relative humidity, sun irradiance, and breeze.
  - **Night Sky & Stargazing**: Cloud turbidity, darkness, and atmospheric clarity.
  - **Plant Care & Gardening**: Natural irrigation history, solar stress, and frost hazard.
  - **Scenic Photography**: Golden hour timing, cloud contrast, and sky diffusion.
- **Smart Wardrobe Advisor**: Generates layered outfit recommendations based on temperature, wind chill, solar UV, and rain. Includes an interactive gear checklist (umbrellas, sunglasses, thermal beanies, etc.).
- **Weekly Strategic Highlights**: Automated highlights identifying the single best outdoor day of the week, heaviest rain risk warnings, and significant thermal swing alerts.

### 7. Dual Unit Systems
- Seamless toggle between **Metric** (°C, km/h, mm, hPa) and **Imperial** (°F, mph, in, inHg) with persistent settings.

---

## 🛠️ APIs & Integrations

This application communicates directly with **Open-Meteo's** free open APIs:

1. **Open-Meteo Geocoding API**
   - **Endpoint**: `https://geocoding-api.open-meteo.com/v1/search`
   - **Parameters**: `name`, `count=8`, `language=en`, `format=json`
   - Converts user input strings to latitude, longitude, country, elevation, and timezone.

2. **Open-Meteo Forecast API**
   - **Endpoint**: `https://api.open-meteo.com/v1/forecast`
   - **Parameters**:
     - `current`: `temperature_2m`, `relative_humidity_2m`, `apparent_temperature`, `is_day`, `precipitation`, `rain`, `showers`, `snowfall`, `weather_code`, `cloud_cover`, `pressure_msl`, `surface_pressure`, `wind_speed_10m`, `wind_direction_10m`, `wind_gusts_10m`, `uv_index`
     - `hourly`: `temperature_2m`, `relative_humidity_2m`, `apparent_temperature`, `precipitation_probability`, `precipitation`, `weather_code`, `wind_speed_10m`, `wind_direction_10m`, `uv_index`, `visibility`
     - `daily`: `weather_code`, `temperature_2m_max`, `temperature_2m_min`, `apparent_temperature_max`, `apparent_temperature_min`, `sunrise`, `sunset`, `uv_index_max`, `precipitation_sum`, `precipitation_probability_max`, `wind_speed_10m_max`, `wind_gusts_10m_max`
     - `forecast_days`: `7`
     - `timezone`: Selected city's standard timezone

---

## 📂 Project Architecture

```
├── index.html                   # HTML entry point with fonts & metadata
├── metadata.json                # AI Studio application metadata
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS v4
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Core state orchestrator & dashboard view
│   ├── index.css                # Global stylesheet & design tokens
│   ├── types/
│   │   └── weather.ts           # Type definitions for Open-Meteo responses & analytics
│   ├── services/
│   │   ├── openMeteo.ts         # Geocoding & Weather Forecast API clients
│   │   └── intelligence.ts      # Activity scores, wardrobe advisor & weekly insights
│   ├── utils/
│   │   ├── units.ts             # Unit formatting & conversions (Metric/Imperial)
│   │   └── weatherCodes.ts      # WMO weather code mapping to labels & theme styling
│   └── components/
│       ├── Header.tsx           # Navigation bar with unit toggle, refresh & geolocation
│       ├── CitySearch.tsx       # Geocoding search input, autocomplete & quick presets
│       ├── CurrentWeatherHero.tsx # Focal anchor card with current conditions
│       ├── WeatherMetricsGrid.tsx # Wind, humidity, UV, pressure, cloud & solar arc
│       ├── HourlyForecastReel.tsx # 24h interactive SVG curve & horizontal carousel
│       ├── DailyForecastList.tsx  # 7-day outlook with relative thermal spectrum bars
│       ├── PlanningIntelligence.tsx # Activity index, wardrobe guide & packing checklist
│       └── WeatherIcon.tsx      # SVG weather condition icons mapping
└── README.md                    # Project documentation
```

---

## 💻 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Plus Jakarta Sans & JetBrains Mono

---

## 🚀 Getting Started

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Development Server
Start the local Vite development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### 3. Production Build
Compile TypeScript and generate an optimized production bundle:
```bash
npm run build
```

### 4. Lint & Typecheck
Validate TypeScript types across the codebase:
```bash
npm run lint
```

---

## 📄 License & Attribution

- Weather data courtesy of [Open-Meteo](https://open-meteo.com/) under the [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) license.
- Geocoding and reverse geocoding via Open-Meteo and OpenStreetMap contributors.
