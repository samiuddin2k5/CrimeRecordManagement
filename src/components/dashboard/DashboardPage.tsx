import React from 'react';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Users, 
  ShieldAlert, 
  ArrowUpRight,
  MapPin,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Crime, Suspect, Investigation } from '../../types';

interface DashboardPageProps {
  crimes: Crime[];
  suspects: Suspect[];
  investigations: Investigation[];
  onNavigateTab: (tab: 'crimes' | 'suspects' | 'investigations' | 'heatmap') => void;
  onSelectCrime: (crime: Crime) => void;
  onOpenNewCrimeModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  crimes,
  suspects,
  investigations,
  onNavigateTab,
  onSelectCrime,
  onOpenNewCrimeModal,
}) => {
  // Compute analytics
  const totalCrimes = crimes.length;
  const openCases = crimes.filter(c => c.status === 'Open' || c.status === 'Under Investigation').length;
  const closedCases = crimes.filter(c => c.status === 'Closed').length;
  const criticalCases = crimes.filter(c => c.severity === 'Critical').length;
  const clearanceRate = totalCrimes > 0 ? Math.round((closedCases / totalCrimes) * 100) : 0;
  const wantedSuspects = suspects.filter(s => s.status === 'Wanted' || s.status === 'Warrant Active').length;

  // Crime categories breakdown
  const categoryCounts = crimes.reduce((acc, crime) => {
    acc[crime.category] = (acc[crime.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  // District breakdown
  const districtCounts = crimes.reduce((acc, crime) => {
    acc[crime.district] = (acc[crime.district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedDistricts = Object.entries(districtCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);

  // Status mapping
  const severityColors = {
    Critical: 'text-rose-400 bg-rose-950/40 border-rose-800/40',
    High: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
    Medium: 'text-blue-400 bg-blue-950/40 border-blue-800/40',
    Low: 'text-slate-400 bg-slate-800/40 border-slate-700/40',
  };

  const statusColors = {
    'Open': 'text-rose-400',
    'Under Investigation': 'text-amber-400',
    'Pending Review': 'text-blue-400',
    'Closed': 'text-emerald-400',
    'Cold Case': 'text-slate-500',
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Operational Briefing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Metropolitan Police Operations Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time crime incident surveillance, active investigation pipelines, and tactical case intelligence.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('heatmap')}
            className="px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>Heatmap Intel</span>
          </button>
          <button
            onClick={onOpenNewCrimeModal}
            className="px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>+ Log Crime Incident</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Incidents</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
              {totalCrimes}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Logged in system</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Open Cases</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums tracking-tight">
              {openCases}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Active investigation</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Critical Priority</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-rose-400 font-mono tabular-nums tracking-tight">
              {criticalCases}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">High threat level</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Resolved Cases</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums tracking-tight">
              {closedCases}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Closed & sentenced</div>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Clearance Rate</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
              {clearanceRate}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Department benchmark</div>
          </div>
        </div>

        {/* Metric 6 */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Wanted Suspects</span>
            <Users className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-rose-300 font-mono tabular-nums tracking-tight">
              {wantedSuspects}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Active warrants</div>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Crime Categories Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Incidents by Offense Type</h2>
              <span className="text-xs text-slate-500 font-mono">{totalCrimes} records</span>
            </div>
            <div className="space-y-3">
              {sortedCategories.map(([category, count]) => {
                const percentage = totalCrimes > 0 ? Math.round((count / totalCrimes) * 100) : 0;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono tabular-nums">{count}</span>
                        <span className="text-slate-500 text-[11px] font-mono tabular-nums w-8 text-right">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* District Risk & Hotspots */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">District Concentration</h2>
              <button
                onClick={() => onNavigateTab('heatmap')}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>View Map</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {sortedDistricts.map(([district, count]) => (
                <div key={district} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-semibold text-slate-200 truncate">{district}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span>Patrol Sector Priority</span>
                      <span>·</span>
                      <span className="font-mono">{count} active cases</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                      {Math.round((count / (totalCrimes || 1)) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Investigations in Flight */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Active Case Taskforces</h2>
              <button
                onClick={() => onNavigateTab('investigations')}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>All {investigations.length}</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {investigations.slice(0, 3).map((inv) => {
                const completedMilestones = inv.milestones.filter(m => m.completed).length;
                const totalMilestones = inv.milestones.length;
                const progressPct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
                
                return (
                  <div key={inv.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{inv.caseTitle}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {inv.caseNumber} · Lead: {inv.leadInvestigator}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/50 text-blue-400 border border-blue-900/40 shrink-0">
                        {inv.status}
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>Milestones: {completedMilestones}/{totalMilestones}</span>
                        <span className="font-mono tabular-nums">{progressPct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Incident Records Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Recent Crime Incident Records</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological log of verified incident reports registered with dispatch
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('crimes')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Manage All Cases</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/50 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Case ID</th>
                <th className="px-5 py-3">Incident Title & Category</th>
                <th className="px-5 py-3">Location / District</th>
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Incident Date</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {crimes.slice(0, 6).map((crime) => (
                <tr 
                  key={crime.id} 
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  onClick={() => onSelectCrime(crime)}
                >
                  <td className="px-5 py-3.5 font-mono font-medium text-blue-400 whitespace-nowrap">
                    {crime.caseNumber}
                  </td>
                  <td className="px-5 py-3.5 max-w-xs">
                    <div className="font-medium text-white truncate">{crime.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {crime.category} · Rep: {crime.reportingOfficerName}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300 max-w-xs truncate">
                    <div>{crime.district}</div>
                    <div className="text-[11px] text-slate-500 truncate">{crime.locationAddress}</div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${severityColors[crime.severity]}`}>
                      {crime.severity}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`font-medium ${statusColors[crime.status]}`}>
                      {crime.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono whitespace-nowrap tabular-nums">
                    {new Date(crime.incidentDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit'
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCrime(crime);
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-blue-400 hover:text-white hover:bg-blue-600/30 rounded border border-blue-500/20 transition-colors cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
