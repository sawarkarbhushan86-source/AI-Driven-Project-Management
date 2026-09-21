import React, { useState } from 'react';
import { Send, User, Paperclip } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ChatBox({ projectId, initialMessages = [] }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: { full_name: "Elena Rostova", role: "TEAM_LEAD", avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" },
      message: "Hey team, please review the latest LiDAR synchronization PR when you get a chance.",
      created_at: "10:30 AM"
    },
    {
      id: 2,
      sender: { full_name: "Alex Chen", role: "DEVELOPER", avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" },
      message: "Taking a look now! Also diving deep into the CUDA memory allocation issue today.",
      created_at: "10:34 AM"
    },
    {
      id: 3,
      sender: { full_name: "Marcus Sterling", role: "PROJECT_MANAGER", avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150" },
      message: "Great work team. The AI risk engine flagged task #2 as a potential 4-day blocker, let me know if we need extra cloud compute.",
      created_at: "10:45 AM"
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: user || { full_name: "Me", role: "DEVELOPER", avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" },
      message: input.trim(),
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInput('');
  };

  return (
    <div className="glass-card rounded-2xl flex flex-col h-[480px] border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Team Discussion Room</h3>
          <p className="text-[11px] text-slate-400">Collaborate with developers and project managers</p>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((m) => {
          const isMe = user && m.sender.full_name === user.full_name;
          return (
            <div key={m.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
              <img
                src={m.sender.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
                alt={m.sender.full_name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700 mt-0.5"
              />
              <div className={`max-w-[75%] ${isMe ? 'items-end' : ''}`}>
                <div className={`flex items-center gap-2 mb-1 text-[11px] ${isMe ? 'justify-end' : ''}`}>
                  <span className="font-semibold text-slate-200">{m.sender.full_name}</span>
                  <span className="text-[10px] text-slate-500">{m.created_at}</span>
                </div>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  isMe 
                    ? 'bg-brand-600 text-white rounded-tr-none shadow-md' 
                    : 'bg-slate-800/90 text-slate-200 rounded-tl-none border border-slate-700/60'
                }`}>
                  {m.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-900/40 flex items-center gap-2">
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Attach file"
        >
          <Paperclip className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message to team..."
          className="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
        />
        <button
          type="submit"
          className="p-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-md transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
