import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Briefcase, 
  UserCheck, 
  Code, 
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import { mockUsers } from '../services/mockData';

export default function Login({ onRegister, onLoggedIn }) {
  const { login, switchRole } = useAuth();
  const [email, setEmail] = useState('pm@aipmp.io');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      onLoggedIn();
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleKey) => {
    switchRole(roleKey);
    onLoggedIn();
  };

  const personas = [
    { role: "ADMIN", label: "Admin", email: "admin@aipmp.io", icon: ShieldCheck, color: "hover:border-purple-500/50 hover:bg-purple-950/20" },
    { role: "PROJECT_MANAGER", label: "Project Manager", email: "pm@aipmp.io", icon: Briefcase, color: "hover:border-blue-500/50 hover:bg-blue-950/20" },
    { role: "TEAM_LEAD", label: "Team Lead", email: "lead@aipmp.io", icon: UserCheck, color: "hover:border-cyan-500/50 hover:bg-cyan-950/20" },
    { role: "DEVELOPER", label: "Developer", email: "dev@aipmp.io", icon: Code, color: "hover:border-emerald-500/50 hover:bg-emerald-950/20" },
    { role: "CLIENT_TEACHER", label: "Teacher / Client", email: "teacher@aipmp.io", icon: GraduationCap, color: "hover:border-amber-500/50 hover:bg-amber-950/20" }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center shadow-xl shadow-brand-500/20 mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sign In to AI-PMP</h2>
          <p className="text-xs text-slate-400 mt-1">AI-Driven Project Management & Progress Monitoring</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl mb-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                <span className="text-[11px] text-brand-400 hover:underline cursor-pointer">Forgot?</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Authenticating..." : "Sign In to Workspace"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center mt-5 text-xs text-slate-400">
            Don't have an account?{" "}
            <button onClick={onRegister} className="text-brand-400 font-semibold hover:underline">
              Create one now
            </button>
          </div>
        </div>

        {/* 1-Click Quick Persona Logins */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
            ⚡ Quick Demo Persona Switcher (1-Click Login)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {personas.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.role}
                  onClick={() => handleQuickLogin(p.role)}
                  className={`p-2.5 rounded-xl border border-slate-800 glass-card text-left transition-all ${p.color} flex items-center gap-2.5`}
                >
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">{p.label}</div>
                    <div className="text-[10px] text-slate-500 truncate">{p.email}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
