import { ActivityScore, CurrentWeatherData, DailyWeatherData, HourlyWeatherData, OutfitRecommendation, PlanningInsight } from '../types/weather.ts';

/**
 * Computes an activity suitability score (0 - 100) and rationale based on local meteorological parameters.
 */
export function calculateActivityScores(
  current: CurrentWeatherData,
  hourly?: HourlyWeatherData
): ActivityScore[] {
  const temp = current.temperature_2m;
  const feelsLike = current.apparent_temperature;
  const wind = current.wind_speed_10m;
  const gusts = current.wind_gusts_10m;
  const humidity = current.relative_humidity_2m;
  const rain = current.precipitation;
  const uv = current.uv_index;
  const clouds = current.cloud_cover;
  const isDay = current.is_day === 1;

  // 1. Running & Jogging
  let runScore = 90;
  if (temp < 5) runScore -= (5 - temp) * 4;
  else if (temp > 22) runScore -= (temp - 22) * 4;
  if (humidity > 75) runScore -= (humidity - 75) * 0.8;
  if (wind > 20) runScore -= (wind - 20) * 1.5;
  if (rain > 0.5) runScore -= 35;
  if (rain > 2) runScore -= 45;
  runScore = Math.max(10, Math.min(100, Math.round(runScore)));

  // 2. Cycling & Commute
  let bikeScore = 92;
  if (wind > 25) bikeScore -= (wind - 25) * 2.2;
  if (gusts > 35) bikeScore -= (gusts - 35) * 1.8;
  if (rain > 0.2) bikeScore -= 40;
  if (temp < 3 || temp > 33) bikeScore -= 25;
  bikeScore = Math.max(10, Math.min(100, Math.round(bikeScore)));

  // 3. Outdoor Dining & Patio
  let diningScore = 95;
  if (!isDay) diningScore -= 10;
  if (temp < 17) diningScore -= (17 - temp) * 5;
  else if (temp > 30) diningScore -= (temp - 30) * 4;
  if (wind > 18) diningScore -= (wind - 18) * 2.5;
  if (rain > 0) diningScore -= 65;
  diningScore = Math.max(5, Math.min(100, Math.round(diningScore)));

  // 4. Outdoor Laundry Drying
  let laundryScore = 85;
  if (!isDay) laundryScore -= 45;
  if (humidity > 60) laundryScore -= (humidity - 60) * 1.2;
  if (rain > 0.1) laundryScore -= 70;
  if (clouds > 70) laundryScore -= 20;
  if (wind >= 10 && wind <= 25) laundryScore += 10;
  laundryScore = Math.max(5, Math.min(100, Math.round(laundryScore)));

  // 5. Stargazing & Night Sky
  let starScore = 95;
  if (isDay) {
    starScore = 15;
  } else {
    starScore -= clouds * 0.8;
    if (humidity > 80) starScore -= 15;
    if (rain > 0) starScore -= 50;
  }
  starScore = Math.max(5, Math.min(100, Math.round(starScore)));

  // 6. Gardening & Plant Watering
  let gardenScore = 88;
  if (rain > 2) {
    gardenScore = 30; // Rain handled watering!
  } else if (temp > 32 || uv >= 8) {
    gardenScore = 55; // Too harsh for direct midday gardening
  } else if (temp < 4) {
    gardenScore = 40; // Frost risk
  }
  gardenScore = Math.max(10, Math.min(100, Math.round(gardenScore)));

  // 7. Photography & Scenic Walks
  let photoScore = 80;
  if (clouds >= 20 && clouds <= 60) photoScore += 15; // dramatic sky
  if (rain > 2) photoScore -= 40;
  if (wind > 35) photoScore -= 20;
  photoScore = Math.max(15, Math.min(100, Math.round(photoScore)));

  const getRating = (score: number): 'Optimal' | 'Good' | 'Fair' | 'Poor' => {
    if (score >= 82) return 'Optimal';
    if (score >= 65) return 'Good';
    if (score >= 45) return 'Fair';
    return 'Poor';
  };

  const getColor = (rating: 'Optimal' | 'Good' | 'Fair' | 'Poor'): string => {
    switch (rating) {
      case 'Optimal':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Good':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'Fair':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Poor':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  return [
    {
      id: 'running',
      name: 'Running & Cardio',
      category: 'fitness',
      score: runScore,
      rating: getRating(runScore),
      badgeColor: getColor(getRating(runScore)),
      reason:
        rain > 0.5
          ? 'Wet surface and active rainfall reduce traction'
          : temp > 25
          ? 'Warm conditions; prioritize hydration and shaded routes'
          : temp < 5
          ? 'Chilly air; wear thermal layers and warm up thoroughly'
          : 'Favorable thermal range and manageable air resistance',
      bestWindow: 'Early morning or late afternoon',
    },
    {
      id: 'cycling',
      name: 'Cycling & Commuting',
      category: 'fitness',
      score: bikeScore,
      rating: getRating(bikeScore),
      badgeColor: getColor(getRating(bikeScore)),
      reason:
        gusts > 35
          ? `Strong gusts (${Math.round(gusts)} km/h) require cautious handling`
          : rain > 0.2
          ? 'Slick road conditions; reduce cornering speed'
          : 'Stable headwinds and dry road contact',
      bestWindow: 'Midday if dry',
    },
    {
      id: 'dining',
      name: 'Patio & Outdoor Dining',
      category: 'lifestyle',
      score: diningScore,
      rating: getRating(diningScore),
      badgeColor: getColor(getRating(diningScore)),
      reason:
        rain > 0
          ? 'Active precipitation requires indoor covered seating'
          : temp < 16
          ? 'Brisk ambient temperature; patio heating recommended'
          : wind > 20
          ? 'Breezy winds may disrupt lightweight tabletop items'
          : 'Pleasant thermal balance and calm airflow',
      bestWindow: isDay ? 'Lunchtime & afternoon' : 'Evening',
    },
    {
      id: 'laundry',
      name: 'Outdoor Line Drying',
      category: 'home',
      score: laundryScore,
      rating: getRating(laundryScore),
      badgeColor: getColor(getRating(laundryScore)),
      reason:
        rain > 0
          ? 'Rain present; dry items indoors'
          : humidity > 70
          ? `High relative humidity (${humidity}%) significantly slows evaporation`
          : !isDay
          ? 'Limited night evaporation without direct solar irradiance'
          : 'Low moisture index and gentle air circulation expedite drying',
      bestWindow: '10:00 - 15:00',
    },
    {
      id: 'stargazing',
      name: 'Night Sky & Stargazing',
      category: 'lifestyle',
      score: starScore,
      rating: getRating(starScore),
      badgeColor: getColor(getRating(starScore)),
      reason: isDay
        ? 'Sunlight blocks celestial visibility until dusk'
        : clouds > 60
        ? `Heavy cloud cover (${clouds}%) obscures stars and constellations`
        : clouds > 25
        ? 'Scattered clouds; partial constellation clarity'
        : 'Crisp, low-turbidity atmospheric clarity',
      bestWindow: 'After 21:00',
    },
    {
      id: 'gardening',
      name: 'Plant Care & Gardening',
      category: 'home',
      score: gardenScore,
      rating: getRating(gardenScore),
      badgeColor: getColor(getRating(gardenScore)),
      reason:
        rain > 2
          ? 'Recent rain has naturally irrigated outdoor soil; pause manual watering'
          : uv >= 8
          ? 'Intense solar UV index; avoid transplanting during peak hours'
          : 'Optimal ambient moisture for tending beds and pruning',
      bestWindow: 'Early morning',
    },
    {
      id: 'photography',
      name: 'Outdoor Photography',
      category: 'lifestyle',
      score: photoScore,
      rating: getRating(photoScore),
      badgeColor: getColor(getRating(photoScore)),
      reason:
        clouds >= 20 && clouds <= 60
          ? 'Dynamic cloud depth generates soft, cinematic diffused lighting'
          : clouds > 85
          ? 'Flat, uniform light under overcast ceiling'
          : rain > 1
          ? 'Atmospheric reflections, though equipment protection is needed'
          : 'Crisp horizons and high contrast sunlight',
      bestWindow: 'Golden hour near sunset/sunrise',
    },
  ];
}

/**
 * Generates an intelligent outfit and gear recommendation based on current temperature,
 * apparent wind chill/heat index, UV index, and precipitation.
 */
export function generateOutfitAdvisor(
  current: CurrentWeatherData,
  daily: DailyWeatherData
): OutfitRecommendation {
  const temp = current.temperature_2m;
  const feelsLike = current.apparent_temperature;
  const rain = current.precipitation;
  const uv = current.uv_index;
  const wind = current.wind_speed_10m;
  const snow = current.snowfall;

  const layers: string[] = [];
  let outerwear = '';
  let footwear = 'Clean sneakers or casual shoes';
  const accessories: string[] = [];
  const precautions: string[] = [];

  // Thermal layering
  if (temp < -5) {
    layers.push('Thermal base layer (merino wool or fleece)', 'Heavy insulated knit sweater');
    outerwear = 'Heavy down parka with windproof/waterproof membrane';
    footwear = 'Insulated winter snow boots with non-slip tread';
    accessories.push('Thermal beanie', 'Insulated winter gloves', 'Fleece neck gaiter');
  } else if (temp < 6) {
    layers.push('Long-sleeve base layer', 'Warm fleece pullover or wool knit');
    outerwear = 'Padded winter coat or insulated trench';
    footwear = 'Weatherproof ankle boots or warm socks with shoes';
    accessories.push('Knit scarf', 'Light gloves');
  } else if (temp < 14) {
    layers.push('Breathable t-shirt', 'Mid-weight sweater or flannel overshirt');
    outerwear = 'Structured trench, denim jacket, or softshell coat';
    footwear = 'Standard sneakers or leather casual shoes';
  } else if (temp < 21) {
    layers.push('Lightweight cotton shirt or t-shirt');
    outerwear = wind > 25 ? 'Light windbreaker' : 'Optional light cardigan for the shade';
    footwear = 'Breathable everyday footwear';
  } else if (temp < 28) {
    layers.push('Breathable linen or organic cotton short-sleeve');
    outerwear = 'No jacket required';
    footwear = 'Canvas slip-ons, sandals, or light running shoes';
  } else {
    layers.push('Ultra-lightweight moisture-wicking apparel, relaxed shorts');
    outerwear = 'No outer layer needed';
    footwear = 'Open sandals or breathable mesh trainers';
    precautions.push('Stay hydrated: carry chilled water');
  }

  // Precipitation & Wind adjustments
  if (snow > 0.5) {
    precautions.push('Snow flurries: expect slippery surfaces and damp edges');
    if (!outerwear.includes('waterproof')) outerwear += ' (water-resistant outer shell)';
    footwear = 'Waterproof grip boots';
  } else if (rain > 0.2 || current.weather_code >= 51) {
    accessories.push('Compact windproof umbrella', 'Water-resistant cap');
    footwear = 'Water-resistant shoes or rain boots';
    precautions.push('Wet streets: keep umbrellas handy and step cautiously on metal grates');
  }

  // UV protection
  if (uv >= 6) {
    accessories.push('Polarized UV400 sunglasses', 'Wide-brim sun hat');
    precautions.push('High UV radiation: apply broad-spectrum SPF 50+ sunscreen');
  } else if (uv >= 3) {
    accessories.push('Sunglasses', 'SPF 30 sunscreen');
  }

  if (wind > 35) {
    precautions.push(`Brisk gusts up to ${Math.round(current.wind_gusts_10m)} km/h: secure loose headwear`);
  }

  let summary = '';
  if (temp > 24) {
    summary = 'Warm and airy outfit recommended. Stay cool and protect yourself from peak sun.';
  } else if (temp > 15) {
    summary = 'Mild, comfortable weather. A balanced two-layer ensemble is ideal.';
  } else if (temp > 7) {
    summary = 'Cool conditions. Medium layering with a dependable jacket will keep you comfortable.';
  } else {
    summary = 'Chilly to freezing. Prioritize thermal retention, neck coverage, and insulated layers.';
  }

  return {
    summary,
    layers,
    outerwear,
    footwear,
    accessories,
    precautions,
  };
}

/**
 * Analyzes the 7-day forecast to find planning highlights:
 * - Best overall outdoor day
 * - Wettest day
 * - Temperature trends
 */
export function analyzeWeeklyOutlook(daily: DailyWeatherData): PlanningInsight[] {
  if (!daily || !daily.time || daily.time.length === 0) return [];

  const insights: PlanningInsight[] = [];
  const days = daily.time.length;

  // Find best day for outdoor activities
  let bestDayIndex = 0;
  let bestScore = -1;
  let rainiestDayIndex = 0;
  let maxRain = 0;

  for (let i = 0; i < days; i++) {
    const maxT = daily.temperature_2m_max[i];
    const rainSum = daily.precipitation_sum[i] || 0;
    const rainProb = daily.precipitation_probability_max[i] || 0;
    const windMax = daily.wind_speed_10m_max[i] || 15;

    if (rainSum > maxRain) {
      maxRain = rainSum;
      rainiestDayIndex = i;
    }

    // Outdoor fitness/comfort score:
    // Ideal temp: 18-24°C
    let score = 100;
    score -= Math.abs(maxT - 21) * 2.5;
    score -= rainSum * 8;
    score -= rainProb * 0.4;
    score -= Math.max(0, windMax - 20) * 1.5;

    if (score > bestScore) {
      bestScore = score;
      bestDayIndex = i;
    }
  }

  const formatDateName = (dateStr: string, index: number) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { weekday: 'long' });
  };

  // Best outdoor day insight
  const bestDayName = formatDateName(daily.time[bestDayIndex], bestDayIndex);
  const bestDayMaxT = Math.round(daily.temperature_2m_max[bestDayIndex]);
  const bestDayRain = daily.precipitation_sum[bestDayIndex]?.toFixed(1) || '0';
  insights.push({
    type: 'opportunity',
    title: `Best Outdoor Day: ${bestDayName}`,
    detail: `High of ${bestDayMaxT}°C with minimal rain (${bestDayRain} mm) and favorable calm winds. Perfect for errands and sports.`,
    icon: 'Sparkles',
  });

  // Rain caution insight
  if (maxRain > 1) {
    const wetDayName = formatDateName(daily.time[rainiestDayIndex], rainiestDayIndex);
    const rainProb = daily.precipitation_probability_max[rainiestDayIndex];
    insights.push({
      type: 'alert',
      title: `Wettest Outlook: ${wetDayName}`,
      detail: `Expect up to ${maxRain.toFixed(1)} mm of precipitation (${rainProb}% likelihood). Plan indoor meetings or pack gear.`,
      icon: 'CloudRain',
    });
  } else {
    insights.push({
      type: 'note',
      title: 'Dry Week Ahead',
      detail: 'No significant rain accumulation detected in the 7-day model. Excellent consistency for outdoor projects.',
      icon: 'Sun',
    });
  }

  // Temperature spread insight
  const allMax = Math.max(...daily.temperature_2m_max);
  const allMin = Math.min(...daily.temperature_2m_min);
  const spread = Math.round(allMax - allMin);

  if (spread >= 10) {
    insights.push({
      type: 'note',
      title: `Noticeable Thermal Swing (Δ ${spread}°C)`,
      detail: `Temperatures fluctuate between a low of ${Math.round(allMin)}°C and high of ${Math.round(allMax)}°C this week. Layer accordingly.`,
      icon: 'TrendingUp',
    });
  }

  return insights;
}
