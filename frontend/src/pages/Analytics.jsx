import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import MetricCard from '../components/MetricCard';
import { 
  LineChart, 
  Users, 
  TrendingDown, 
  Sliders, 
  Sparkles, 
  Clock, 
  CheckSquare, 
  BarChart3,
  Award 
} from 'lucide-react';

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Delay Simulation Sandbox State
  const [taskCount, setTaskCount] = useState(60);
  const [pendingTasks, setPendingTasks] = useState(35);
  const [teamSize, setTeamSize] = useState(6);
  const [avgHours, setAvgHours] = useState(18);
  const [blockerCount, setBlockerCount] = useState(2);
  const [simResult, setSimResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getDashboardSummary();
        setSummary(data);
      } finally {
        setLoading(false);
      }
    }
    load();
    runSimulation();
  }, []);

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const completed = Math.max(0, taskCount - pendingTasks);
      const workload = pendingTasks / (teamSize * 4.0);
      const res = await api.predictDelay({
        task_count: Number(taskCount),
        completed_tasks: completed,
        pending_tasks: Number(pendingTasks),
        team_size: Number(teamSize),
        average_completion_time: Number(avgHours),
        resource_allocation: Number(workload),
        historical_delays: 2.0,
        blocker_count: Number(blockerCount)
      });
      setSimResult(res);
    } finally {
      setSimulating(false);
    }
  };

  if (loading || !summary) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Analytics & ML Intelligence</h1>
        <p className="text-xs text-slate-400">Deep velocity analytics, burndown progression, and predictive delay simulation</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricCard
          title="Team Velocity Rate"
          value="4.2 Tasks / Day"
          delta="+14% this sprint"
          subtext="Calculated across 3 active squads"
          icon={TrendingDown}
          color="emerald"
        />
        <MetricCard
          title="Mean Completion Duration"
          value="15.8 Hours"
          delta="Optimized"
          subtext="Average dev time from In Progress to Review"
          icon={Clock}
          color="brand"
        />
        <MetricCard
          title="Top Performer Score"
          value="96.0 / 100"
          delta="Elena Rostova"
          subtext="15 tasks closed on-time"
          icon={Award}
          color="purple"
        />
      </div>

      {/* ML Delay Prediction Interactive Simulator Sandbox */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-brand-500/30 bg-gradient-to-r from-brand-950/20 via-slate-900/60 to-purple-950/20 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Delay Simulation Sandbox</h2>
              <p className="text-xs text-slate-400">Test hypothetical team constraints against the trained XGBoost / Random Forest model</p>
            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={simulating}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md flex items-center gap-2 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>{simulating ? "Predicting..." : "Simulate Delay"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Pending Tasks:</span>
                  <span className="text-brand-400">{pendingTasks} of {taskCount}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max={taskCount}
                  value={pendingTasks}
                  onChange={(e) => setPendingTasks(e.target.value)}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Team Size (Engineers):</span>
                  <span className="text-brand-400">{teamSize} Engineers</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Avg Task Duration (Hours):</span>
                  <span className="text-brand-400">{avgHours}h</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="40"
                  value={avgHours}
                  onChange={(e) => setAvgHours(e.target.value)}
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Active Blockers:</span>
                  <span className="text-rose-400">{blockerCount} Blockers</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={blockerCount}
                  onChange={(e) => setBlockerCount(e.target.value)}
                  className="w-full accent-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Real-time ML Prediction Output Box */}
          <div className="glass-card p-5 rounded-2xl border border-slate-700 bg-slate-900/90 text-center space-y-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Model Inference Output</span>
            {simResult && (
              <>
                <div className={`text-4xl font-extrabold ${
                  simResult.predicted_delay_days > 7 ? 'text-rose-400' :
                  simResult.predicted_delay_days > 2 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  +{simResult.predicted_delay_days} <span className="text-base font-normal">Days</span>
                </div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold border border-slate-700 bg-slate-800 text-white">
                  Risk Tier: {simResult.risk_level}
                </div>
                <div className="text-xs text-slate-400">
                  Project Health: <strong className="text-white">{simResult.health_score} / 100</strong>
                </div>
                <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                  Powered by {simResult.engine || "XGBoost Engine"}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Team Productivity Rankings */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Developer Velocity Leaderboard</h3>
            <p className="text-xs text-slate-400">Performance rankings based on completed points and on-time rate</p>
          </div>
          <Users className="w-4 h-4 text-slate-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="pb-3 font-semibold">Engineer</th>
                <th className="pb-3 font-semibold">Completed Tasks</th>
                <th className="pb-3 font-semibold">Avg Hours / Task</th>
                <th className="pb-3 font-semibold">Productivity Score</th>
                <th className="pb-3 font-semibold text-right">Delivery Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {summary.team_productivity.map((dev, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-semibold text-white flex items-center gap-2">
                    <span className="w-5 text-slate-500 font-normal">#{idx + 1}</span>
                    <span>{dev.developer_name}</span>
                  </td>
                  <td className="py-3 text-slate-300">{dev.tasks_completed} Tasks</td>
                  <td className="py-3 text-slate-400">{dev.avg_hours_per_task} hrs</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-400" 
                          style={{ width: `${dev.productivity_score}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-white">{dev.productivity_score}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Optimal
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
