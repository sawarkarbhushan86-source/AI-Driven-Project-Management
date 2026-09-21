import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  FileCheck, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Reports() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProj, setSelectedProj] = useState(1);
  const [reportType, setReportType] = useState('WEEKLY');
  const [customNotes, setCustomNotes] = useState('');
  const [reports, setReports] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function load() {
      const [pData, rData] = await Promise.all([
        api.getProjects(),
        api.getReports()
      ]);
      setProjects(pData);
      setReports(rData);
      if (pData.length > 0) setSelectedProj(pData[0].id);
    }
    load();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const newReport = await api.generateReport(
        Number(selectedProj),
        reportType,
        customNotes
      );
      setReports([newReport, ...reports]);
      setSuccessMsg("AI Executive Status Report successfully compiled! PDF and Excel exports ready.");
      setCustomNotes('');
      setTimeout(() => setSuccessMsg(''), 5000);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Report Generator & Export Center</h1>
        <p className="text-xs text-slate-400">Generate executive weekly and monthly progress audits with PDF & Excel downloads</p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Generator Configuration Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Generate Progress Briefing</h2>
            <p className="text-[11px] text-slate-400">Synthesizes sprint burndown, team velocity, and risk forecast</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Project</label>
              <select
                value={selectedProj}
                onChange={(e) => setSelectedProj(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Report Interval</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="WEEKLY">Weekly Sprint Progress Audit</option>
                <option value="MONTHLY">Monthly Executive Summary</option>
                <option value="SPRINT">Milestone Retrospective</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Leadership Notes (Optional)</label>
            <textarea
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Note that edge Jetson hardware testing is scheduled for next Monday."
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={generating}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{generating ? "Synthesizing Report..." : "Generate & Compile Report"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Reports Archive */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white">Generated Progress Audits & Files</h3>

        <div className="space-y-3">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{rep.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-800">
                    {rep.report_type}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 max-w-2xl leading-relaxed">
                  {rep.summary}
                </p>
                <div className="text-[10px] text-slate-500 flex items-center gap-2 pt-1">
                  <Calendar className="w-3 h-3" />
                  <span>Created: {new Date(rep.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Downloads */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <a
                  href={`http://localhost:8000/api/v1/reports/download/pdf/${rep.pdf_filename || 'sample.pdf'}`}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="px-3.5 py-2 rounded-xl glass-card hover:bg-slate-800 text-xs font-semibold text-rose-300 border border-rose-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-rose-400" />
                  <span>PDF Export</span>
                </a>
                <a
                  href={`http://localhost:8000/api/v1/reports/download/excel/${rep.excel_filename || 'sample.xlsx'}`}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="px-3.5 py-2 rounded-xl glass-card hover:bg-slate-800 text-xs font-semibold text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Excel Export</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
