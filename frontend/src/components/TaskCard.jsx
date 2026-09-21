import React from 'react';
import { AlertCircle, Clock, CheckCircle2, ChevronRight, User } from 'lucide-react';

export default function TaskCard({ task, onStatusChange, onSelect }) {
  const priorityColors = {
    LOW: "text-slate-400 bg-slate-800/60 border-slate-700",
    MEDIUM: "text-blue-400 bg-blue-950/40 border-blue-800/40",
    HIGH: "text-amber-400 bg-amber-950/40 border-amber-800/40",
    URGENT: "text-rose-400 bg-rose-950/40 border-rose-800/40 font-bold"
  };

  const nextStatuses = {
    TODO: "IN_PROGRESS",
    IN_PROGRESS: "IN_REVIEW",
    IN_REVIEW: "COMPLETED",
    BLOCKED: "IN_PROGRESS",
    COMPLETED: "TODO"
  };

  return (
    <div className={`p-4 rounded-xl glass-card transition-all border ${
      task.is_at_risk ? 'border-rose-500/50 bg-rose-950/10' : 'hover:border-slate-600'
    } shadow-md`}>
      {/* Risk Alert Flag */}
      {task.is_at_risk && (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-400 bg-rose-950/40 px-2 py-1 rounded-md mb-2 border border-rose-800/40">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{task.risk_reason || "AI flagged schedule risk"}</span>
        </div>
      )}

      {/* Header & Priority */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${priorityColors[task.priority] || priorityColors.MEDIUM}`}>
          {task.priority}
        </span>
        {task.deadline && (
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="w-3 h-3" />
            <span>{task.deadline}</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h4 
        onClick={() => onSelect && onSelect(task)}
        className="text-sm font-semibold text-white mb-2 leading-snug cursor-pointer hover:text-brand-400 transition-colors"
      >
        {task.title}
      </h4>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
          <span>Progress</span>
          <span className="font-semibold text-slate-200">{task.progress_percentage}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              task.progress_percentage === 100 
                ? 'bg-emerald-500' 
                : task.is_at_risk 
                ? 'bg-rose-500' 
                : 'bg-brand-500'
            }`}
            style={{ width: `${task.progress_percentage}%` }}
          />
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          {task.assigned_to ? (
            <img
              src={task.assigned_to.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
              alt={task.assigned_to.full_name}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-700"
              title={task.assigned_to.full_name}
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">
              <User className="w-3 h-3" />
            </div>
          )}
          <span className="text-[11px] text-slate-400 truncate max-w-[100px]">
            {task.assigned_to?.full_name?.split(' ')[0] || "Unassigned"}
          </span>
        </div>

        {/* Quick Transition button */}
        <button
          onClick={() => onStatusChange(task.id, nextStatuses[task.status])}
          className="flex items-center gap-1 text-[11px] font-semibold text-brand-400 hover:text-brand-300 px-2 py-1 rounded-md hover:bg-slate-800/80 transition-colors"
          title={`Move to ${nextStatuses[task.status]}`}
        >
          <span>Move</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
