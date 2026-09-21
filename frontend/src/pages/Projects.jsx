import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import HealthBadge from '../components/HealthBadge';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Calendar, 
  DollarSign, 
  ArrowRight, 
  Archive, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Projects({ onSelectProject, onNavigate }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState(50000);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const newProj = await api.createProject({
      name,
      description: desc,
      status: "IN_PROGRESS",
      start_date: today,
      deadline: deadline || "2026-11-30",
      budget: Number(budget)
    });
    setProjects([newProj, ...projects]);
    setShowModal(false);
    setName('');
    setDesc('');
  };

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const canCreate = user?.role === "ADMIN" || user?.role === "PROJECT_MANAGER";

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Projects Management</h1>
          <p className="text-xs text-slate-400">Track delivery health, AI delay forecasts, and milestone status</p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by keyword..."
            className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "IN_PROGRESS", "PLANNING", "COMPLETED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-brand-600 text-white'
                  : 'glass-card text-slate-400 hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {proj.status}
                </span>
                <HealthBadge score={proj.health_score} />
              </div>

              {/* Title & Desc */}
              <h3 
                onClick={() => {
                  onSelectProject(proj.id);
                  onNavigate('project-detail');
                }}
                className="text-base font-bold text-white mb-2 cursor-pointer group-hover:text-brand-400 transition-colors"
              >
                {proj.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {proj.description}
              </p>

              {/* Prediction Pill */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 mb-4 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>AI Delay Forecast:</span>
                </div>
                <span className={`font-bold ${
                  proj.predicted_delay_days > 4 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  +{proj.predicted_delay_days} Days ({proj.delay_risk_level || "LOW"})
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Deadline: {proj.deadline}</span>
              </div>

              <button
                onClick={() => {
                  onSelectProject(proj.id);
                  onNavigate('project-detail');
                }}
                className="flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 glass-card rounded-2xl border border-slate-800">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">No projects match your filter</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting the status filter or keyword search.</p>
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-150">
            <h2 className="text-lg font-bold text-white mb-1">Create New Project</h2>
            <p className="text-xs text-slate-400 mb-5">Define project scope, timeline, and allocation.</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. NextGen Autonomous Navigation"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  placeholder="Project goals, objectives, and deliverables..."
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Budget ($ USD)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md"
                >
                  Create & Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
