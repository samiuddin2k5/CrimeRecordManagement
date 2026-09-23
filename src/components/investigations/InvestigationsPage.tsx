import React, { useState } from 'react';
import { 
  FolderGit2, 
  Search, 
  Plus, 
  CheckCircle, 
  Clock, 
  FileText, 
  Send, 
  X, 
  Calendar, 
  ChevronRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Investigation, Crime, InvestigationLog } from '../../types';

interface InvestigationsPageProps {
  investigations: Investigation[];
  crimes: Crime[];
  onAddInvestigation: (inv: Omit<Investigation, 'id'>) => Promise<Investigation>;
  onUpdateInvestigation: (id: string, updates: Partial<Investigation>) => Promise<Investigation | null>;
}

export const InvestigationsPage: React.FC<InvestigationsPageProps> = ({
  investigations,
  crimes,
  onAddInvestigation,
  onUpdateInvestigation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvId, setSelectedInvId] = useState<string>(investigations[0]?.id || '');
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);

  // New log entry form state
  const [logType, setLogType] = useState<InvestigationLog['type']>('Note');
  const [logEntry, setLogEntry] = useState('');
  const [logOfficer, setLogOfficer] = useState('Det. Marcus Vance');

  const activeInvestigation = investigations.find(i => i.id === selectedInvId) || investigations[0];

  const handleToggleMilestone = async (milestoneId: string) => {
    if (!activeInvestigation) return;
    const updatedMilestones = activeInvestigation.milestones.map(m => {
      if (m.id === milestoneId) {
        return { ...m, completed: !m.completed };
      }
      return m;
    });

    await onUpdateInvestigation(activeInvestigation.id, {
      milestones: updatedMilestones,
    });
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInvestigation || !logEntry.trim()) return;

    const newLog: InvestigationLog = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      officerName: logOfficer,
      type: logType,
      entry: logEntry.trim(),
    };

    const updatedLogs = [newLog, ...activeInvestigation.logs];
    await onUpdateInvestigation(activeInvestigation.id, {
      logs: updatedLogs,
    });

    setLogEntry('');
  };

  const filtered = investigations.filter(i => 
    i.caseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.leadInvestigator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Active Case Investigations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Taskforce case management, evidence vault tracking, chronological investigative logs, and judicial milestones.
          </p>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left List of Investigations */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter active case files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto">
            {filtered.map((inv) => {
              const isSelected = inv.id === activeInvestigation?.id;
              const completedCount = inv.milestones.filter(m => m.completed).length;
              const pct = inv.milestones.length > 0 ? Math.round((completedCount / inv.milestones.length) * 100) : 0;

              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvId(inv.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/10 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[11px] font-mono text-blue-400 font-bold">
                        {inv.caseNumber}
                      </span>
                      <h3 className="text-xs font-bold text-white truncate mt-0.5">
                        {inv.caseTitle}
                      </h3>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Lead: {inv.leadInvestigator} · {inv.department}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                      {inv.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80">
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Milestones: {completedCount}/{inv.milestones.length}</span>
                      <span className="font-mono tabular-nums">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Case File Detail */}
        {activeInvestigation ? (
          <div className="lg:col-span-2 space-y-6">
            {/* Case Overview Card */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-blue-400">
                      {activeInvestigation.caseNumber}
                    </span>
                    <span className="text-[11px] font-semibold text-rose-400 px-2 py-0.5 rounded bg-rose-950/40 border border-rose-800/40">
                      {activeInvestigation.priority}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">
                    {activeInvestigation.caseTitle}
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Evidence Vault Reference</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {activeInvestigation.evidenceVaultId}
                  </span>
                </div>
              </div>

              {/* Lead & Dates */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Lead Investigator</span>
                  <span className="text-slate-200 font-semibold">{activeInvestigation.leadInvestigator}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Assigned Division</span>
                  <span className="text-slate-200 font-semibold truncate">{activeInvestigation.department}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Initiated Date</span>
                  <span className="text-slate-200 font-mono">{activeInvestigation.startDate}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Target Closure</span>
                  <span className="text-slate-200 font-mono">{activeInvestigation.targetClosureDate}</span>
                </div>
              </div>

              {/* Milestones Checklist */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Investigation Milestones & Court Requirements</span>
                  <span className="text-slate-500 text-[11px] font-normal">Click check to toggle completion</span>
                </h3>
                <div className="space-y-2">
                  {activeInvestigation.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleToggleMilestone(m.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        m.completed
                          ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                          m.completed ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600'
                        }`}>
                          {m.completed && <CheckCircle className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className={`text-xs font-medium truncate ${m.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                          {m.title}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap">
                        {m.date} {m.completedBy ? `· ${m.completedBy}` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chronological Investigation Timeline / Logs */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Chronological Intelligence Logs ({activeInvestigation.logs.length})
                </h3>

                {/* Log Entry Form */}
                <form onSubmit={handleAddLog} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 mb-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400">Record New Entry:</span>
                    <select
                      value={logType}
                      onChange={(e) => setLogType(e.target.value as any)}
                      className="bg-slate-900 border border-slate-800 text-slate-300 text-[11px] rounded px-2 py-1 focus:outline-none"
                    >
                      <option value="Note">Note / Update</option>
                      <option value="Evidence">Evidence Logged</option>
                      <option value="Interview">Witness / Suspect Interview</option>
                      <option value="Warrant">Judicial Warrant</option>
                      <option value="Forensics">Forensics Lab Report</option>
                      <option value="Ballistics">Ballistics Report</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Officer name"
                      value={logOfficer}
                      onChange={(e) => setLogOfficer(e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-slate-300 text-[11px] rounded px-2 py-1 ml-auto w-40 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Enter verified intelligence log entry or procedural action taken..."
                      value={logEntry}
                      onChange={(e) => setLogEntry(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Log</span>
                    </button>
                  </div>
                </form>

                {/* Log List */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {activeInvestigation.logs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                            log.type === 'Evidence'
                              ? 'text-amber-400 bg-amber-950/40 border-amber-800/50'
                              : log.type === 'Warrant'
                              ? 'text-rose-400 bg-rose-950/40 border-rose-800/50'
                              : log.type === 'Forensics'
                              ? 'text-blue-400 bg-blue-950/40 border-blue-800/50'
                              : 'text-slate-300 bg-slate-800 border-slate-700'
                          }`}>
                            {log.type}
                          </span>
                          <span className="font-semibold text-white">{log.officerName}</span>
                        </div>
                        <span className="text-slate-500 font-mono tabular-nums">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-300 pl-1 leading-relaxed">
                        {log.entry}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 p-8 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 text-sm">
            Select an active investigation file from the left to view timeline and evidence logs.
          </div>
        )}
      </div>
    </div>
  );
};
