import React from 'react';
import TaskCard from './TaskCard';

export default function KanbanColumn({ statusKey, title, tasks = [], color, onStatusChange, onSelectTask }) {
  const borderColors = {
    TODO: "border-slate-700 bg-slate-900/30",
    IN_PROGRESS: "border-brand-600/40 bg-brand-950/10",
    IN_REVIEW: "border-purple-600/40 bg-purple-950/10",
    COMPLETED: "border-emerald-600/40 bg-emerald-950/10",
    BLOCKED: "border-rose-600/40 bg-rose-950/10"
  };

  const pillColors = {
    TODO: "bg-slate-800 text-slate-300",
    IN_PROGRESS: "bg-brand-950 text-brand-400 border border-brand-800",
    IN_REVIEW: "bg-purple-950 text-purple-400 border border-purple-800",
    COMPLETED: "bg-emerald-950 text-emerald-400 border border-emerald-800",
    BLOCKED: "bg-rose-950 text-rose-400 border border-rose-800"
  };

  return (
    <div className={`flex flex-col rounded-2xl border ${borderColors[statusKey] || 'border-slate-800'} p-3.5 min-w-[280px] w-full flex-1`}>
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">{title}</h3>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${pillColors[statusKey]}`}>
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3 overflow-y-auto flex-1 max-h-[calc(100vh-280px)] pr-1">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onSelect={onSelectTask}
          />
        ))}
        {tasks.length === 0 && (
          <div className="h-32 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-500">
            No tasks in this lane
          </div>
        )}
      </div>
    </div>
  );
}
