import React from 'react';

export default function MetricCard({ title, value, delta, subtext, icon: Icon, color = "brand" }) {
  const colorMap = {
    brand: "text-cyan-400 bg-cyan-950/40 border-cyan-800/40",
    emerald: "text-emerald-400 bg-emerald-950/40 border-emerald-800/40",
    rose: "text-rose-400 bg-rose-950/40 border-rose-800/40",
    amber: "text-amber-400 bg-amber-950/40 border-amber-800/40",
    purple: "text-purple-400 bg-purple-950/40 border-purple-800/40"
  };

  const badgeClass = colorMap[color] || colorMap.brand;

  return (
    <div className="glass-card rounded-2xl p-5 hover:border-slate-700 transition-all hover:translate-y-[-2px] duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${badgeClass}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
        {delta && (
          <span className={`text-xs font-semibold ${delta.startsWith('+') || delta.includes('On Track') ? 'text-emerald-400' : 'text-rose-400'}`}>
            {delta}
          </span>
        )}
      </div>
      {subtext && <p className="text-[11px] text-slate-400">{subtext}</p>}
    </div>
  );
}
