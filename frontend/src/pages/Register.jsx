import React, { useState } from 'react';
import { Sparkles, User, Mail, Lock, Building, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function Register({ onLogin, onRegistered }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('DEVELOPER');
  const [department, setDepartment] = useState('Engineering');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.register({
        full_name: fullName,
        email,
        password,
        role,
        department
      });
      onRegistered();
    } catch (err) {
      setError('Registration failed. Please check inputs or try another email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center shadow-xl shadow-brand-500/20 mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create AI-PMP Account</h2>
          <p className="text-xs text-slate-400 mt-1">Select your team role to begin</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="e.g. Alex Mercer"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="alex@company.io"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min 6 characters"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="DEVELOPER">Developer</option>
                  <option value="TEAM_LEAD">Team Lead</option>
                  <option value="PROJECT_MANAGER">Project Manager</option>
                  <option value="CLIENT_TEACHER">Teacher / Client</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Engineering"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center mt-5 text-xs text-slate-400">
            Already registered?{" "}
            <button onClick={onLogin} className="text-brand-400 font-semibold hover:underline">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
