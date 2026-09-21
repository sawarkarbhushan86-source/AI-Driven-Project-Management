import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import MetricCard from '../components/MetricCard';
import HealthBadge from '../components/HealthBadge';
import { 
  FolderKanban, 
  CheckSquare, 
  Activity, 
  ShieldAlert, 
  Clock, 
  ArrowUpRight, 
  Bot, 
  TrendingDown, 
  Users, 
  AlertTriangle 
} from 'lucide-react';

export default function Dashboard({ onNavigate, onSelectProject }) {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [teacherOverview, setTeacherOverview] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [dashData, teacherData] = await Promise.all([
          api.getDashboardSummary(),
          api.getTeacherOverview()
        ]);
        setSummary(dashData);
        setTeacherOverview(teacherData);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !summary) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div>
          <p className="text-xs text-slate-400">Loading AI analytics dashboard...</p>
        </div>
      </div>
    );
  }

  const isTeacher = user?.role === "CLIENT_TEACHER" || user?.role === "ADMIN";

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Executive Project Monitor
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-bold border border-brand-500/30">
              Live AI Inference
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Welcome back, <span className="text-slate-200 font-semibold">{user?.full_name}</span>. Real-time delivery health and risk overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('updates')}
            className="px-4 py-2 rounded-xl glass-card hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Submit Standup</span>
          </button>
          <button
            onClick={() => onNavigate('ai-assistant')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Copilot</span>
          </button>
        </div>
      </div>

      {/* AI Delay Forecast Banner */}
      <div className="glass-card p-4 rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-950/30 via-slate-900/60 to-brand-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 mt-0.5">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">AI Predictive Warning</span>
              <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800/60 font-semibold">
                High Risk
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Project <span className="font-semibold text-white">Autonomous Drone Navigation Stack</span> has predicted delay of 
              <span className="font-bold text-rose-400"> +4.5 days</span> due to a CUDA memory blocker.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('ai-assistant')}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors whitespace-nowrap shadow-md"
        >
          Inspect Mitigations
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Active Projects"
          value={`${summary.active_projects} / ${summary.total_projects}`}
          delta="3 In Progress"
          subtext="1 archived/completed"
          icon={FolderKanban}
          color="brand"
        />
        <MetricCard
          title="Average Health Score"
          value={`${summary.average_health_score} / 100`}
          delta={summary.average_health_score > 80 ? "On Track" : "Needs Attention"}
          subtext="Computed from velocity & risks"
          icon={Activity}
          color="emerald"
        />
        <MetricCard
          title="Sprint Completion %"
          value={`${summary.overall_completion_percentage}%`}
          delta={`${summary.completed_tasks} of ${summary.total_tasks} Tasks`}
          subtext="Linear sprint burn rate"
          icon={CheckSquare}
          color="purple"
        />
        <MetricCard
          title="Critical Path Risks"
          value={summary.high_risk_projects_count}
          delta={summary.high_risk_projects_count > 0 ? "Action Required" : "Zero Critical"}
          subtext={`${summary.blocked_tasks} tasks currently blocked`}
          icon={ShieldAlert}
          color="rose"
        />
      </div>

      {/* Teacher / Client Multi-Project Oversight (If Teacher / Client) */}
      {isTeacher && (
        <div className="glass-card rounded-2xl p-6 border border-amber-500/30 bg-amber-950/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Teacher & Stakeholder Multi-Project Oversight</h3>
                <p className="text-xs text-slate-400">Real-time audit of all student and team projects under review</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Evaluator Mode
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="pb-3 font-semibold">Project Name</th>
                  <th className="pb-3 font-semibold">Lead</th>
                  <th className="pb-3 font-semibold">Health Score</th>
                  <th className="pb-3 font-semibold">Delay Risk</th>
                  <th className="pb-3 font-semibold">Progress</th>
                  <th className="pb-3 font-semibold">Blockers</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {teacherOverview.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-semibold text-white">{item.name}</td>
                    <td className="py-3 text-slate-300">{item.lead_name}</td>
                    <td className="py-3">
                      <HealthBadge score={item.health_score} />
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.predicted_delay_days > 4 
                          ? 'bg-rose-950 text-rose-400 border border-rose-800' 
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        +{item.predicted_delay_days}d ({item.delay_risk_level})
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${item.completion_percentage}%` }}></div>
                        </div>
                        <span className="text-[11px] text-slate-300">{item.completion_percentage}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={item.active_blockers_count > 0 ? "text-rose-400 font-bold" : "text-slate-400"}>
                        {item.active_blockers_count}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => {
                          onSelectProject(item.id);
                          onNavigate('project-detail');
                        }}
                        className="text-brand-400 hover:text-brand-300 font-semibold"
                      >
                        Inspect &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Visuals: Burndown & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Burndown Chart Card */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Sprint Burndown Velocity</h3>
              <p className="text-xs text-slate-400">Ideal vs. Actual Remaining Effort (Hours)</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-0.5 bg-slate-500"></span> Ideal Scope
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Actual Burn
              </span>
            </div>
          </div>

          {/* Lightweight Responsive SVG Burndown Chart */}
          <div className="h-56 w-full pt-4">
            <div className="h-full w-full flex items-end justify-between gap-2 border-b border-l border-slate-800 px-2 pb-1">
              {summary.burndown_series.map((pt, i) => {
                const maxVal = 200;
                const idealHeight = (pt.ideal_remaining / maxVal) * 100;
                const actualHeight = (pt.actual_remaining / maxVal) * 100;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Hover Tooltip */}
                    <div className="absolute -top-12 bg-slate-900 border border-slate-700 text-white text-[10px] p-1.5 rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                      <div>Actual: {pt.actual_remaining}h</div>
                      <div>Ideal: {pt.ideal_remaining}h</div>
                    </div>

                    <div className="w-full flex items-end justify-center gap-1 h-44">
                      {/* Ideal Bar (ghosted) */}
                      <div 
                        className="w-2 bg-slate-800 rounded-t"
                        style={{ height: `${idealHeight}%` }}
                      />
                      {/* Actual Bar (vibrant) */}
                      <div 
                        className="w-3 bg-gradient-to-t from-brand-600 to-cyan-400 rounded-t shadow-md shadow-brand-500/20"
                        style={{ height: `${actualHeight}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 truncate">{pt.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Task Status Breakdown */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Task Status Breakdown</h3>
            <p className="text-xs text-slate-400 mb-6">Current backlog distribution across all projects</p>

            <div className="space-y-3.5">
              {[
                { label: "Todo (Queued)", count: summary.status_distribution.todo, color: "bg-slate-600", text: "text-slate-300" },
                { label: "In Progress", count: summary.status_distribution.in_progress, color: "bg-brand-500", text: "text-brand-300" },
                { label: "In Review", count: summary.status_distribution.in_review, color: "bg-purple-500", text: "text-purple-300" },
                { label: "Completed", count: summary.status_distribution.completed, color: "bg-emerald-500", text: "text-emerald-300" },
                { label: "Blocked (Risk)", count: summary.status_distribution.blocked, color: "bg-rose-500 animate-pulse", text: "text-rose-300" },
              ].map((item, idx) => {
                const pct = Math.round((item.count / max(1, summary.total_tasks)) * 100);
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className={`font-medium ${item.text}`}>{item.label}</span>
                      <span className="font-bold text-white">{item.count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigate('tasks')}
            className="w-full mt-6 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors text-center"
          >
            Open Kanban Board &rarr;
          </button>
        </div>
      </div>

      {/* Projects Grid & Recent Standup Blockers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monitored Projects */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Monitored Projects</h3>
              <p className="text-xs text-slate-400">Health scores and machine-predicted milestone dates</p>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {summary.top_projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  onSelectProject(proj.id);
                  onNavigate('project-detail');
                }}
                className="p-4 rounded-xl glass-card border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white hover:text-brand-400 transition-colors">
                      {proj.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {proj.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 max-w-lg">
                    {proj.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <HealthBadge score={proj.health_score} />
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500">Predicted Delay</div>
                    <div className={`text-xs font-bold ${
                      proj.predicted_delay_days > 4 ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      +{proj.predicted_delay_days} Days
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Daily Standup Blockers */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Active Blockers</h3>
              <p className="text-xs text-slate-400">Reported in recent daily standups</p>
            </div>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>

          <div className="space-y-3">
            {summary.recent_blockers.map((b) => (
              <div key={b.id} className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs">
                <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
                  <span className="truncate max-w-[150px]">{b.task_title}</span>
                  <span className="text-[10px] text-slate-500">{b.developer_name}</span>
                </div>
                <p className="text-rose-300 text-[11px] leading-relaxed">
                  "{b.blocker_text}"
                </p>
              </div>
            ))}
            {summary.recent_blockers.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-500">
                No active blockers reported today! 🎉
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function max(a, b) {
  return a > b ? a : b;
}
