import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import HealthBadge from '../components/HealthBadge';
import GanttChart from '../components/GanttChart';
import ChatBox from '../components/ChatBox';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Plus, 
  ShieldAlert, 
  MessageSquare,
  ListTodo,
  TrendingDown
} from 'lucide-react';

export default function ProjectDetail({ projectId, onBack, onNavigate }) {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('gantt'); // 'gantt', 'tasks', 'risks', 'chat'
  const [recalculating, setRecalculating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [projData, taskData] = await Promise.all([
          api.getProjectDetail(projectId),
          api.getTasks(projectId)
        ]);
        setProject(projData);
        setTasks(taskData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [projectId]);

  const handleEvaluateHealth = async () => {
    setRecalculating(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/projects/${projectId}/evaluate-health`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (res.ok) {
        const updated = await api.getProjectDetail(projectId);
        setProject(updated);
      }
    } catch (e) {
      console.warn("Using client health recalculation:", e);
    } finally {
      setRecalculating(false);
    }
  };

  if (loading || !project) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div>
          <p className="text-xs text-slate-400">Loading project details...</p>
        </div>
      </div>
    );
  }

  const blockedCount = tasks.filter(t => t.status === "BLOCKED").length;
  const completedCount = tasks.filter(t => t.status === "COMPLETED").length;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl glass-card hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{project.name}</h1>
              <HealthBadge score={project.health_score} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{project.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleEvaluateHealth}
            disabled={recalculating}
            className="px-4 py-2 rounded-xl glass-card hover:bg-slate-800 text-xs font-semibold text-brand-300 border border-brand-500/30 flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>{recalculating ? "Evaluating..." : "Run AI Health Audit"}</span>
          </button>
          <button
            onClick={() => onNavigate('tasks')}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-colors"
          >
            Manage Kanban &rarr;
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <div className="text-[11px] text-slate-400">ML Delay Prediction</div>
          <div className={`text-xl font-bold mt-1 ${
            project.predicted_delay_days > 4 ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            +{project.predicted_delay_days} Days
          </div>
          <div className="text-[10px] text-slate-500">Risk Tier: {project.delay_risk_level || "LOW"}</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <div className="text-[11px] text-slate-400">Milestone Progress</div>
          <div className="text-xl font-bold text-white mt-1">
            {project.progress_percentage || 0}%
          </div>
          <div className="text-[10px] text-slate-500">{completedCount} of {tasks.length} tasks completed</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <div className="text-[11px] text-slate-400">Target Deadline</div>
          <div className="text-xl font-bold text-white mt-1">
            {project.deadline}
          </div>
          <div className="text-[10px] text-slate-500">Started: {project.start_date}</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <div className="text-[11px] text-slate-400">Active Blockers</div>
          <div className={`text-xl font-bold mt-1 ${blockedCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            {blockedCount} Tasks
          </div>
          <div className="text-[10px] text-slate-500">{blockedCount > 0 ? 'Action required' : 'Clear sailing'}</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'gantt', label: 'Gantt Timeline', icon: Calendar },
          { id: 'tasks', label: `Tasks List (${tasks.length})`, icon: ListTodo },
          { id: 'risks', label: 'AI Risk Detector', icon: ShieldAlert },
          { id: 'chat', label: 'Team Chat Room', icon: MessageSquare }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'gantt' && (
        <GanttChart tasks={tasks} />
      )}

      {activeTab === 'tasks' && (
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="pb-3 font-semibold">Task</th>
                  <th className="pb-3 font-semibold">Assignee</th>
                  <th className="pb-3 font-semibold">Priority</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Progress</th>
                  <th className="pb-3 font-semibold">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-semibold text-white">
                      <div>{t.title}</div>
                      {t.is_at_risk && (
                        <div className="text-[10px] text-rose-400 font-normal mt-0.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{t.risk_reason || "Flagged at risk"}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-slate-300">
                      {t.assigned_to?.full_name || "Unassigned"}
                    </td>
                    <td className="py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        t.status === 'BLOCKED' ? 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse' :
                        'bg-brand-950 text-brand-400 border border-brand-800'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${t.progress_percentage}%` }} />
                        </div>
                        <span className="text-[11px] text-slate-400">{t.progress_percentage}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-400">{t.deadline || "TBD"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'risks' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-brand-950/20 border border-brand-500/20 text-xs text-slate-300 flex items-center justify-between">
            <div>
              <span className="font-bold text-white">AI Health Assessment: </span>
              Project is monitored with live statistical anomaly detection.
            </div>
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="text-brand-400 hover:text-brand-300 font-semibold"
            >
              Ask Copilot for Fixes &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-rose-500/40 bg-rose-950/10">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>CUDA Memory Leak on Edge Hardware (CRITICAL)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Jetson Orin runs out of memory during continuous 30-minute SLAM loop execution. Blocks Task #2.
              </p>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                <span className="font-semibold text-brand-400">AI Suggested Mitigation: </span>
                Downgrade to Jetpack 5.1.2 or pin buffer allocations using zero-copy memory.
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-amber-500/40 bg-amber-950/10">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>Milestone Slippage Risk (MEDIUM)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Velocity Estimator task dependency delay due to blocker in SLAM feature extractor.
              </p>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                <span className="font-semibold text-brand-400">AI Suggested Mitigation: </span>
                Temporarily reallocate Sarah Jenkins to assist Alex Chen on memory leak debugging.
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <ChatBox projectId={projectId} />
      )}
    </div>
  );
}
