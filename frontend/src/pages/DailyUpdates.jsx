import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Clock, CheckCircle2, AlertCircle, Plus, Send, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DailyUpdates() {
  const { user } = useAuth();
  const [updates, setUpdates] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(1);
  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [blockers, setBlockers] = useState('None');
  const [progress, setProgress] = useState(50);
  const [hours, setHours] = useState(4);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [uData, tData] = await Promise.all([
          api.getUpdates(),
          api.getTasks()
        ]);
        setUpdates(uData);
        setTasks(tData);
        if (tData.length > 0) setSelectedTask(tData[0].id);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newUpdate = await api.submitUpdate({
        task_id: Number(selectedTask),
        yesterday_work: yesterday,
        today_plan: today,
        blockers: blockers || "None",
        progress_percentage: Number(progress),
        hours_spent: Number(hours)
      });
      setUpdates([newUpdate, ...updates]);
      setSuccessMsg("Daily progress update logged successfully! AI health score synced.");
      setYesterday('');
      setToday('');
      setBlockers('None');
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Daily Standup System</h1>
        <p className="text-xs text-slate-400">Log yesterday's work, today's plan, and active blockers for AI risk scanning</p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Standup Submission Form */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Log Today's Standup Progress</h2>
            <p className="text-[11px] text-slate-400">Syncs directly with task progression and predictive delay models</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Active Task</label>
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                {tasks.map(t => (
                  <option key={t.id} value={t.id}>#{t.id} - {t.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hours Logged Today</label>
                <input
                  type="number"
                  step="0.5"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Yesterday's Work (What did you complete?)</label>
            <textarea
              value={yesterday}
              onChange={(e) => setYesterday(e.target.value)}
              required
              rows={2}
              placeholder="e.g. Completed unit tests for LiDAR point cloud filter and verified coordinate transform."
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Today's Plan (What will you work on?)</label>
            <textarea
              value={today}
              onChange={(e) => setToday(e.target.value)}
              required
              rows={2}
              placeholder="e.g. Profiling CUDA memory allocations on physical Jetson Orin device."
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Blockers & Impediments <span className="text-[11px] font-normal text-slate-400">(Put "None" if unblocked)</span>
            </label>
            <input
              type="text"
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="e.g. Jetpack 6.0 driver crash when batch size > 8"
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Logging..." : "Submit Daily Standup"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Standup Updates Feed */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white">Recent Team Standup Activity</h3>

        <div className="space-y-3">
          {updates.map((u) => {
            const hasBlocker = u.blockers && u.blockers.toLowerCase() !== "none" && u.blockers.trim() !== "";
            return (
              <div key={u.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={u.user?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                      alt={u.user?.full_name || "User"}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                    />
                    <div>
                      <span className="text-xs font-bold text-white">{u.user?.full_name || "Developer"}</span>
                      <span className="text-[10px] text-slate-400 ml-2">Task #{u.task_id}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500">{new Date(u.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Yesterday:</span>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">{u.yesterday_work}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Today's Plan:</span>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">{u.today_plan}</p>
                  </div>
                </div>

                {hasBlocker ? (
                  <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span><strong>Blocker:</strong> {u.blockers}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>No impediments reported</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
