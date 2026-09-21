import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import KanbanColumn from '../components/KanbanColumn';
import { Plus, Filter, CheckSquare, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // New task form state
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [projId, setProjId] = useState(1);
  const [priority, setPriority] = useState('MEDIUM');
  const [deadline, setDeadline] = useState('');
  const [estHours, setEstHours] = useState(16);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [tData, pData] = await Promise.all([
          api.getTasks(),
          api.getProjects()
        ]);
        setTasks(tData);
        setProjects(pData);
        if (pData.length > 0) setProjId(pData[0].id);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    const updated = await api.updateTaskStatus(taskId, newStatus);
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const newTask = await api.createTask({
      project_id: Number(projId),
      title,
      description: desc,
      priority,
      status: "TODO",
      deadline: deadline || "2026-10-15",
      estimated_hours: Number(estHours),
      assigned_to_id: user ? user.id : 4
    });
    setTasks([...tasks, newTask]);
    setShowModal(false);
    setTitle('');
    setDesc('');
  };

  const filteredTasks = selectedProject === 'ALL'
    ? tasks
    : tasks.filter(t => t.project_id === Number(selectedProject));

  const columns = [
    { key: "TODO", title: "To Do (Queued)" },
    { key: "IN_PROGRESS", title: "In Progress" },
    { key: "IN_REVIEW", title: "In Review / QA" },
    { key: "COMPLETED", title: "Completed" },
    { key: "BLOCKED", title: "Blocked (Risk)" }
  ];

  const canCreate = user?.role !== "CLIENT_TEACHER";

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Interactive Task Kanban</h1>
          <p className="text-xs text-slate-400">Drag and transition tasks across development lanes</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Project Filter */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="ALL">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {canCreate && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(col => (
          <KanbanColumn
            key={col.key}
            statusKey={col.key}
            title={col.title}
            tasks={filteredTasks.filter(t => t.status === col.key)}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-md p-6 rounded-2xl border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-150">
            <h2 className="text-lg font-bold text-white mb-1">Create Sprint Task</h2>
            <p className="text-xs text-slate-400 mb-4">Add a new deliverable to the project pipeline</p>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Project</label>
                <select
                  value={projId}
                  onChange={(e) => setProjId(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Implement ROS2 sensor sync node"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={2}
                  placeholder="Technical acceptance criteria..."
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Est. Hours</label>
                  <input
                    type="number"
                    value={estHours}
                    onChange={(e) => setEstHours(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
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
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
