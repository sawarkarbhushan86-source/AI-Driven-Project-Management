import React from 'react';

export default function HealthBadge({ score }) {
  const numScore = Number(score) || 0;

  let colorClass = "bg-emerald-950/50 text-emerald-300 border-emerald-500/40";
  let dotClass = "bg-emerald-400";
  let label = "Optimal";

  if (numScore < 70) {
    colorClass = "bg-rose-950/50 text-rose-300 border-rose-500/40";
    dotClass = "bg-rose-400 animate-ping";
    label = "Critical Risk";
  } else if (numScore < 88) {
    colorClass = "bg-amber-950/50 text-amber-300 border-amber-500/40";
    dotClass = "bg-amber-400";
    label = "Moderate Risk";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
      <span>{numScore.toFixed(1)} / 100 ({label})</span>
    </span>
  );
}
