import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  LineChart, 
  Bot, 
  FileText, 
  Settings,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ currentPage, onNavigate }) {
  const { user } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects & Health', icon: FolderKanban },
    { id: 'tasks', label: 'Task Kanban', icon: CheckSquare },
    { id: 'updates', label: 'Daily Standups', icon: Clock },
    { id: 'analytics', label: 'Analytics & Burndown', icon: LineChart },
    { id: 'ai-assistant', label: 'AI Copilot & Risks', icon: Bot, badge: 'AI' },
    { id: 'reports', label: 'Reports & Exports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 glass-header border-r border-slate-800/80 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-cyan-600 text-white shadow-md shadow-brand-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI Insight Card */}
        <div className="p-3.5 rounded-xl glass-card border border-brand-500/20 bg-brand-950/20">
          <div className="flex items-center gap-2 text-brand-400 text-xs font-semibold mb-1">
            <Bot className="w-4 h-4" />
            <span>AI Risk Monitor</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
            Model predicts 4.5d delay on Drone Stack. Reallocate resources to avoid sprint breach.
          </p>
          <button
            onClick={() => onNavigate('ai-assistant')}
            className="w-full py-1.5 px-2.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 text-[11px] font-semibold transition-colors text-center"
          >
            Launch Copilot
          </button>
        </div>
      </div>

      {/* Role Footer Card */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex items-center gap-2 px-2 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-brand-400"></span>
          <span>Role active:</span>
          <span className="font-semibold text-white uppercase">{user?.role?.replace('_', ' ')}</span>
        </div>
      </div>
    </aside>
  );
}
