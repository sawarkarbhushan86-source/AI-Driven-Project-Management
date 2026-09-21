import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Bell, 
  Sparkles, 
  LogOut, 
  ShieldCheck, 
  UserCheck, 
  Briefcase, 
  Code, 
  GraduationCap 
} from 'lucide-react';
import { mockNotifications } from '../services/mockData';

export default function Navbar({ onNavigate, currentPage }) {
  const { user, logout, switchRole } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const roleLabels = {
    ADMIN: { label: "Admin", icon: ShieldCheck, color: "text-purple-400 bg-purple-950/40 border-purple-800/50" },
    PROJECT_MANAGER: { label: "Project Manager", icon: Briefcase, color: "text-blue-400 bg-blue-950/40 border-blue-800/50" },
    TEAM_LEAD: { label: "Team Lead", icon: UserCheck, color: "text-cyan-400 bg-cyan-950/40 border-cyan-800/50" },
    DEVELOPER: { label: "Developer", icon: Code, color: "text-emerald-400 bg-emerald-950/40 border-emerald-800/50" },
    CLIENT_TEACHER: { label: "Teacher / Client", icon: GraduationCap, color: "text-amber-400 bg-amber-950/40 border-amber-800/50" }
  };

  const currentRoleConfig = user ? roleLabels[user.role] || roleLabels.DEVELOPER : roleLabels.DEVELOPER;
  const CurrentIcon = currentRoleConfig.icon;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-header px-6 py-3.5 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-white tracking-tight">AI-PMP</span>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              v1.0 Pro
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">AI-Driven Project & Progress Monitoring</p>
        </div>
      </div>

      {/* AI Live Status Badge */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/30">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span className="text-xs font-medium text-emerald-300">AI Monitoring Engine: ACTIVE</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Button (Crucial for Demo evaluation across all 5 roles) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${currentRoleConfig.color}`}
            title="Click to switch between all 5 user personas"
          >
            <CurrentIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Role:</span>
            <span className="font-semibold">{currentRoleConfig.label}</span>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch User Persona
              </div>
              {Object.entries(roleLabels).map(([roleKey, conf]) => {
                const Icon = conf.icon;
                return (
                  <button
                    key={roleKey}
                    onClick={() => {
                      switchRole(roleKey);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                      user?.role === roleKey ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{conf.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 glass-card rounded-xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/50">
                <span className="font-semibold text-xs text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="text-[11px] text-brand-400 hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-lg text-xs transition-colors ${
                      n.is_read ? 'bg-slate-900/40 text-slate-400' : 'bg-brand-950/40 border border-brand-800/40 text-slate-200'
                    }`}
                  >
                    <div className="font-semibold text-white mb-0.5">{n.title}</div>
                    <p className="line-clamp-2 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Info & Logout */}
        {user && (
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="w-8 h-8 rounded-full ring-2 ring-brand-500/40 object-cover"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-white leading-tight">{user.full_name}</div>
              <div className="text-[10px] text-slate-400">{user.department}</div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors ml-1"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
