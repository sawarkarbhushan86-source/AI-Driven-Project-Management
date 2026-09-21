import React, { useState } from 'react';
import { api } from '../services/api';
import { 
  Bot, 
  Send, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AiAssistant({ onNavigate }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hello! I am your **AI Project Management Copilot**.\n\nI monitor live database states, analyze developer velocity, predict delivery delays using ML models, and suggest corrective actions to keep your sprints on track.\n\nHow can I help you today?",
      suggested_actions: ["Analyze Drone Stack Delays", "Generate Weekly Report Summary", "Explain CUDA Blocker"]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const presetQueries = [
    "Why is the Autonomous Drone Stack delayed?",
    "Suggest corrective actions for the CUDA memory leak",
    "Give me an executive summary of sprint health",
    "Which developers have the highest workload right now?"
  ];

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await api.aiChat(textToSend);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.response,
        suggested_actions: res.suggested_actions || []
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "⚠️ Apologies, error connecting to the AI inference service. Please check network connection.",
        suggested_actions: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>AI Project Copilot</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                Gemini 2.5 & ML Engine
              </span>
            </h1>
            <p className="text-xs text-slate-400">Context-aware Q&A, risk diagnostics, and smart corrective suggestions</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('reports')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card text-xs font-semibold text-slate-300 hover:text-white"
        >
          <span>Export Reports</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Preset Prompts Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1 whitespace-nowrap">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Presets:
        </span>
        {presetQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-xl glass-card text-xs text-slate-300 hover:text-brand-300 hover:border-brand-500/40 whitespace-nowrap transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 glass-card rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4 border border-slate-800">
        {messages.map((m, i) => {
          const isUser = m.role === 'user';
          return (
            <div key={i} className={`flex gap-3.5 ${isUser ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isUser 
                  ? 'bg-brand-600 text-white' 
                  : 'bg-gradient-to-tr from-cyan-600 to-brand-500 text-white shadow-md'
              }`}>
                {isUser ? user?.full_name?.charAt(0) || "U" : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] ${isUser ? 'items-end' : ''}`}>
                <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser 
                    ? 'bg-brand-600 text-white rounded-tr-none shadow-md' 
                    : 'bg-slate-900/90 text-slate-200 rounded-tl-none border border-slate-700/60 shadow-lg'
                }`}>
                  {m.content}
                </div>

                {/* Suggested Action Buttons */}
                {!isUser && m.suggested_actions && m.suggested_actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {m.suggested_actions.map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(`Execute action: ${act}`)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-brand-950/40 hover:bg-brand-900/60 text-brand-300 border border-brand-800/60 transition-colors font-medium"
                      >
                        ⚡ {act}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 items-center text-xs text-slate-400">
            <div className="w-7 h-7 rounded-full bg-cyan-600/30 flex items-center justify-center animate-spin">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <span>Analyzing project graph and formulating recommendations...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Copilot about schedule risks, code blockers, or team velocity..."
          className="flex-1 bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-md"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
