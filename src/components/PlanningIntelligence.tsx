import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  Shirt,
  Umbrella,
  Sun,
  Wind,
  Sparkles,
  Compass,
  Check,
} from 'lucide-react';
import { ActivityScore, OutfitRecommendation, PlanningInsight } from '../types/weather.ts';

interface PlanningIntelligenceProps {
  activities: ActivityScore[];
  outfit: OutfitRecommendation;
  insights: PlanningInsight[];
}

export const PlanningIntelligence: React.FC<PlanningIntelligenceProps> = ({
  activities,
  outfit,
  insights,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'fitness' | 'lifestyle' | 'home'>('all');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const filteredActivities =
    selectedCategory === 'all'
      ? activities
      : activities.filter((a) => a.category === selectedCategory);

  const toggleCheck = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <div className="space-y-6">
      {/* 1. Weekly Strategic Planner Insights */}
      {insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                insight.type === 'opportunity'
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                  : insight.type === 'alert'
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-200'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {insight.type === 'opportunity' ? (
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                ) : insight.type === 'alert' ? (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                ) : (
                  <Compass className="w-5 h-5 text-cyan-400" />
                )}
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold tracking-tight text-white">
                  {insight.title}
                </div>
                <div className="text-xs text-slate-300/90 leading-relaxed">
                  {insight.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Activity Suitability Index Section */}
      <div id="activity-planner" className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-semibold text-white tracking-tight">
                Activity Suitability Index
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated ratings derived from real-time wind speed, surface moisture, solar irradiance, and thermal comfort.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800/80 rounded-lg self-start sm:self-auto">
            {(['all', 'fitness', 'lifestyle', 'home'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Activities' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700/80 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold text-slate-100">{act.name}</span>
                <span
                  className={`px-2 py-0.5 text-xs font-mono font-medium rounded border ${act.badgeColor}`}
                >
                  {act.rating} · {act.score}%
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {act.reason}
              </p>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Best window:</span>
                <span className="text-cyan-400">{act.bestWindow || 'Flexible'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. What to Wear / Wardrobe Advisor */}
      <div id="outfit-advisor" className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
        <div className="flex items-center gap-2">
          <Shirt className="w-4 h-4 text-cyan-400" />
          <h2 className="text-base font-semibold text-white tracking-tight">
            What to Wear Today (Smart Wardrobe Advisor)
          </h2>
        </div>

        <p className="text-sm text-slate-200 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed">
          {outfit.summary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Layering & Tops */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2.5">
            <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] font-mono flex items-center gap-1.5">
              <span>01. Layering & Tops</span>
            </div>
            <ul className="space-y-1.5 text-slate-300">
              {outfit.layers.map((layer, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>{layer}</span>
                </li>
              ))}
              {outfit.outerwear && (
                <li className="flex items-center gap-2 font-medium text-slate-100 pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>Outerwear: {outfit.outerwear}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Footwear & Protection */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2.5">
            <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] font-mono flex items-center gap-1.5">
              <span>02. Footwear & Step</span>
            </div>
            <p className="text-slate-300">{outfit.footwear}</p>

            {outfit.precautions.length > 0 && (
              <div className="pt-2 border-t border-slate-800/60 space-y-1 text-slate-400">
                <span className="text-[10px] uppercase font-mono text-slate-400">Notices:</span>
                {outfit.precautions.map((p, i) => (
                  <div key={i} className="text-amber-300/90 text-xs">
                    • {p}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gear & Packing Essentials Checklist */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2.5">
            <div className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] font-mono flex items-center justify-between">
              <span>03. Packing Checklist</span>
              <span className="text-cyan-400 text-[10px]">Click to pack</span>
            </div>

            {outfit.accessories.length > 0 ? (
              <div className="space-y-1.5">
                {outfit.accessories.map((acc, i) => {
                  const isChecked = !!checkedItems[acc];
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleCheck(acc)}
                      className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                        isChecked
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className={isChecked ? 'line-through text-slate-400' : ''}>
                        {acc}
                      </span>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked
                            ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                            : 'border-slate-700 bg-slate-950'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-slate-400 text-xs">
                No special gear required for current conditions. Standard carry is fine.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
