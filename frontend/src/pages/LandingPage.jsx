import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Bot, 
  ShieldAlert, 
  Clock, 
  Users, 
  FileSpreadsheet,
  GraduationCap
} from 'lucide-react';

export default function LandingPage({ onGetStarted, onLogin }) {
  const features = [
    {
      icon: Clock,
      title: "Predictive Delay Modeling",
      description: "Trained Random Forest and XGBoost algorithms predict milestone slippage before it happens."
    },
    {
      icon: ShieldAlert,
      title: "Automated Risk Detection",
      description: "Continuously scans daily standup blockers, task dependencies, and resource overload to flag risks."
    },
    {
      icon: Bot,
      title: "GenAI Project Copilot",
      description: "Ask natural language questions about sprint velocity, explain bottlenecks, and get smart action plans."
    },
    {
      icon: GraduationCap,
      title: "Multi-Role Real-Time Oversight",
      description: "Dedicated dashboards for Admins, Project Managers, Team Leads, Developers, and Academic Teachers."
    },
    {
      icon: BarChart3,
      title: "Sprint Burndown & Velocity",
      description: "Automated burn-down analytics, workload distribution heatmaps, and team productivity rankings."
    },
    {
      icon: FileSpreadsheet,
      title: "Executive Reports (PDF & Excel)",
      description: "Generate comprehensive weekly and monthly progress audits with 1-click formatted exports."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Top Bar */}
      <nav className="glass-header px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">AI-PMP</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onLogin}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white shadow-md shadow-brand-500/20 transition-all"
          >
            Launch Platform
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-20 pb-16 text-center max-w-5xl mx-auto flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-brand-500/30 text-xs font-semibold text-brand-300 mb-6 mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Next-Generation Intelligent Project Monitoring</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Manage Projects with <br />
          <span className="bg-gradient-to-r from-brand-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
            Predictive AI Intelligence
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          AI monitors project health, predicts delays with machine learning, detects team bottlenecks, and generates executive status reports in real time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white text-sm font-bold shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <span>Explore Live Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onLogin}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-card hover:bg-slate-800/80 text-slate-200 text-sm font-semibold border border-slate-700 transition-colors"
          >
            Demo Role Switcher
          </button>
        </div>

        {/* Live Metrics Showcase Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400">ML Model R² Accuracy</div>
            <div className="text-2xl font-bold text-white mt-1">95.5%</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">XGBoost & Random Forest</div>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400">Delay Forecast Horizon</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">1-45 Days</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Early risk warning</div>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400">Supported User Personas</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">5 Roles</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Admin, PM, Lead, Dev, Teacher</div>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400">Automated Exports</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">PDF & Excel</div>
            <div className="text-[10px] text-slate-400 mt-0.5">1-click reports</div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Engineered for Modern Engineering Organizations
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            From daily developer standups to executive board reporting, AI-PMP unifies the entire software delivery lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-brand-500/40 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-header py-8 px-8 text-center text-xs text-slate-500 border-t border-slate-800">
        AI-Driven Project Management and Progress Monitoring Platform &copy; 2026. Production-Ready Industry Implementation.
      </footer>
    </div>
  );
}
