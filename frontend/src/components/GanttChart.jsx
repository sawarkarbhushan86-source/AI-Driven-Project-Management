import React from 'react';

export default function GanttChart({ tasks = [] }) {
  const statusColors = {
    TODO: "bg-slate-600",
    IN_PROGRESS: "bg-brand-500",
    IN_REVIEW: "bg-purple-500",
    COMPLETED: "bg-emerald-500",
    BLOCKED: "bg-rose-500 animate-pulse"
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Sprint Milestone & Gantt Timeline</h3>
          <p className="text-xs text-slate-400">Chronological schedule and task progression</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Completed</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-brand-500"></span> In Progress</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500"></span> Blocked</span>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task, idx) => {
          // Dynamic offset and width based on index and progress
          const leftPercent = Math.min(65, idx * 12);
          const widthPercent = Math.max(25, task.progress_percentage || 30);

          return (
            <div key={task.id} className="group">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span className="font-semibold truncate max-w-xs">{task.title}</span>
                <span className="text-[11px] text-slate-400">Due: {task.deadline || "Next Week"} ({task.progress_percentage}%)</span>
              </div>
              <div className="w-full h-5 rounded-lg bg-slate-900/60 p-0.5 relative overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-md ${statusColors[task.status] || 'bg-brand-500'} flex items-center justify-end px-2 text-[10px] font-bold text-white transition-all duration-500 shadow-sm`}
                  style={{
                    marginLeft: `${leftPercent}%`,
                    width: `${widthPercent}%`
                  }}
                >
                  <span className="truncate">{task.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
