import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Settings as SettingsIcon, 
  User, 
  ShieldCheck, 
  Bell, 
  Cpu, 
  Save, 
  CheckCircle2 
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [standupReminder, setStandupReminder] = useState(true);
  const [saved, setSaved] = useState(false);

  const rolePermissions = {
    ADMIN: "Full unrestricted platform access: create/delete projects, manage all users, override health settings, system audits.",
    PROJECT_MANAGER: "Create & edit projects, assign tasks to engineers, set budgets & deadlines, generate executive PDF/Excel reports.",
    TEAM_LEAD: "Break down tasks, review developer daily standups, manage sprint backlogs, approve QA tickets.",
    DEVELOPER: "View assigned tasks, update Kanban status, submit daily standups (yesterday, today, blockers), participate in team chat.",
    CLIENT_TEACHER: "Read-only multi-project oversight, evaluate student/client deliverables, inspect real-time AI health scores and risk metrics."
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">System & Account Settings</h1>
        <p className="text-xs text-slate-400">Manage user profile, notification dispatching, and role permissions</p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* User Profile Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <User className="w-4 h-4 text-brand-400" />
          <h2 className="text-sm font-bold text-white">Active User Profile</h2>
        </div>

        <div className="flex items-center gap-5">
          <img
            src={user?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
            alt={user?.full_name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-brand-500/40"
          />
          <div>
            <h3 className="text-base font-bold text-white">{user?.full_name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <div className="mt-2 inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-950 text-brand-300 border border-brand-800">
              Role: {user?.role}
            </div>
          </div>
        </div>

        {/* Role Permissions Callout */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-brand-400 font-bold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Role Permissions & Capabilities:</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {rolePermissions[user?.role] || rolePermissions.DEVELOPER}
          </p>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Bell className="w-4 h-4 text-brand-400" />
          <h2 className="text-sm font-bold text-white">Notification Alert Preferences</h2>
        </div>

        <div className="space-y-4 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800 cursor-pointer">
            <div>
              <div className="font-semibold text-white">Critical Risk & Blocker Alerts</div>
              <div className="text-[11px] text-slate-400">Dispatch alerts when tasks enter BLOCKED status or ML predicts delay</div>
            </div>
            <input
              type="checkbox"
              checked={riskAlerts}
              onChange={(e) => setRiskAlerts(e.target.checked)}
              className="accent-brand-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800 cursor-pointer">
            <div>
              <div className="font-semibold text-white">Daily Standup Reminders</div>
              <div className="text-[11px] text-slate-400">Receive reminder at 09:30 AM to log yesterday's work and today's plan</div>
            </div>
            <input
              type="checkbox"
              checked={standupReminder}
              onChange={(e) => setStandupReminder(e.target.checked)}
              className="accent-brand-500 w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800 cursor-pointer">
            <div>
              <div className="font-semibold text-white">Executive Weekly Email Digest</div>
              <div className="text-[11px] text-slate-400">Receive compiled PDF and Excel status summary every Friday afternoon</div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="accent-brand-500 w-4 h-4"
            />
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      {/* System Engine Health Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white">System & Engine Telemetry</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400">FastAPI Backend:</span>
            <div className="text-emerald-400 font-bold mt-1">CONNECTED (Port 8000)</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400">ML Model Weights:</span>
            <div className="text-cyan-400 font-bold mt-1">XGBoost v3.2 (Active)</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400">GenAI Inference Engine:</span>
            <div className="text-purple-400 font-bold mt-1">Gemini 2.5 Flash / Copilot</div>
          </div>
        </div>
      </div>
    </div>
  );
}
