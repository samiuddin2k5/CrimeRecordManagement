import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Eye, 
  Calendar, 
  MapPin, 
  ShieldAlert, 
  FileText, 
  Check, 
  X, 
  AlertTriangle,
  Download,
  Share2
} from 'lucide-react';
import { Crime, CrimeCategory, CrimeSeverity, CrimeStatus, Suspect, Victim, Witness } from '../../types';
import { DISTRICTS } from '../../lib/localStorage';

interface CrimesPageProps {
  crimes: Crime[];
  suspects: Suspect[];
  victims: Victim[];
  witnesses: Witness[];
  onAddCrime: (crime: Omit<Crime, 'id' | 'updatedAt'>) => Promise<Crime>;
  onUpdateCrime: (id: string, updates: Partial<Crime>) => Promise<Crime | null>;
  onDeleteCrime: (id: string) => Promise<boolean>;
  selectedCrimeDetail: Crime | null;
  onClearSelectedCrime: () => void;
  onSelectCrime: (c: Crime) => void;
}

const CATEGORIES: CrimeCategory[] = [
  'Homicide',
  'Armed Robbery',
  'Cybercrime',
  'Narcotics',
  'Aggravated Assault',
  'Financial Fraud',
  'Burglary',
  'Kidnapping',
];

const SEVERITIES: CrimeSeverity[] = ['Critical', 'High', 'Medium', 'Low'];
const STATUSES: CrimeStatus[] = [
  'Open',
  'Under Investigation',
  'Pending Review',
  'Closed',
  'Cold Case',
];

export const CrimesPage: React.FC<CrimesPageProps> = ({
  crimes,
  suspects,
  victims,
  witnesses,
  onAddCrime,
  onUpdateCrime,
  onDeleteCrime,
  selectedCrimeDetail,
  onClearSelectedCrime,
  onSelectCrime,
}) => {
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrime, setEditingCrime] = useState<Crime | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    caseNumber: '',
    title: '',
    category: 'Armed Robbery' as CrimeCategory,
    severity: 'High' as CrimeSeverity,
    status: 'Open' as CrimeStatus,
    incidentDate: new Date().toISOString().slice(0, 16),
    district: DISTRICTS[0].name,
    locationAddress: '',
    reportingOfficerName: 'Marcus Vance',
    leadInvestigatorName: 'Sarah Jenkins',
    summary: '',
    evidenceItems: '',
    suspectIds: [] as string[],
    victimIds: [] as string[],
    witnessIds: [] as string[],
  });

  const handleOpenAddModal = () => {
    setEditingCrime(null);
    const randomCaseNum = `CR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setFormData({
      caseNumber: randomCaseNum,
      title: '',
      category: 'Armed Robbery',
      severity: 'High',
      status: 'Open',
      incidentDate: new Date().toISOString().slice(0, 16),
      district: DISTRICTS[0].name,
      locationAddress: '',
      reportingOfficerName: 'Marcus Vance',
      leadInvestigatorName: 'Sarah Jenkins',
      summary: '',
      evidenceItems: '',
      suspectIds: [],
      victimIds: [],
      witnessIds: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (crime: Crime) => {
    setEditingCrime(crime);
    setFormData({
      caseNumber: crime.caseNumber,
      title: crime.title,
      category: crime.category,
      severity: crime.severity,
      status: crime.status,
      incidentDate: crime.incidentDate ? new Date(crime.incidentDate).toISOString().slice(0, 16) : '',
      district: crime.district,
      locationAddress: crime.locationAddress,
      reportingOfficerName: crime.reportingOfficerName,
      leadInvestigatorName: crime.leadInvestigatorName || '',
      summary: crime.summary,
      evidenceItems: crime.evidenceItems.join('\n'),
      suspectIds: crime.suspectIds || [],
      victimIds: crime.victimIds || [],
      witnessIds: crime.witnessIds || [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const evidenceList = formData.evidenceItems
      .split('\n')
      .map(item => item.trim())
      .filter(Boolean);

    const targetDistrict = DISTRICTS.find(d => d.name === formData.district) || DISTRICTS[0];

    if (editingCrime) {
      await onUpdateCrime(editingCrime.id, {
        caseNumber: formData.caseNumber,
        title: formData.title,
        category: formData.category,
        severity: formData.severity,
        status: formData.status,
        incidentDate: new Date(formData.incidentDate).toISOString(),
        district: formData.district,
        locationAddress: formData.locationAddress,
        coordinates: targetDistrict.center,
        reportingOfficerName: formData.reportingOfficerName,
        leadInvestigatorName: formData.leadInvestigatorName,
        summary: formData.summary,
        evidenceItems: evidenceList,
        suspectIds: formData.suspectIds,
        victimIds: formData.victimIds,
        witnessIds: formData.witnessIds,
      });
    } else {
      await onAddCrime({
        caseNumber: formData.caseNumber,
        title: formData.title,
        category: formData.category,
        severity: formData.severity,
        status: formData.status,
        incidentDate: new Date(formData.incidentDate).toISOString(),
        reportedDate: new Date().toISOString(),
        district: formData.district,
        locationAddress: formData.locationAddress,
        coordinates: targetDistrict.center,
        reportingOfficerId: 'off-1',
        reportingOfficerName: formData.reportingOfficerName,
        leadInvestigatorId: 'off-2',
        leadInvestigatorName: formData.leadInvestigatorName,
        summary: formData.summary,
        evidenceItems: evidenceList,
        suspectIds: formData.suspectIds,
        victimIds: formData.victimIds,
        witnessIds: formData.witnessIds,
      });
    }
    setIsModalOpen(false);
  };

  // Filter logic
  const filteredCrimes = crimes.filter((c) => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.locationAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
    const matchesSeverity = filterSeverity === 'All' || c.severity === filterSeverity;
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;

    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
  });

  const severityBadge = (sev: CrimeSeverity) => {
    switch (sev) {
      case 'Critical':
        return 'text-rose-400 bg-rose-950/40 border-rose-800/40';
      case 'High':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
      case 'Medium':
        return 'text-blue-400 bg-blue-950/40 border-blue-800/40';
      case 'Low':
        return 'text-slate-400 bg-slate-800/40 border-slate-700/40';
    }
  };

  const statusBadge = (st: CrimeStatus) => {
    switch (st) {
      case 'Open':
        return 'text-rose-400';
      case 'Under Investigation':
        return 'text-amber-400';
      case 'Pending Review':
        return 'text-blue-400';
      case 'Closed':
        return 'text-emerald-400';
      case 'Cold Case':
        return 'text-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Crime Incident Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative registry of reported crimes, evidence inventories, and primary case dossiers.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Crime</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by case number, incident title, summary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Severities</option>
            {SEVERITIES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            {STATUSES.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Crimes Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Case ID</th>
                <th className="px-5 py-3">Title & Category</th>
                <th className="px-5 py-3">District & Address</th>
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Reporting Officer</th>
                <th className="px-5 py-3">Incident Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCrimes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                    No crime records match the active search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCrimes.map((crime) => (
                  <tr 
                    key={crime.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono font-medium text-blue-400 whitespace-nowrap">
                      {crime.caseNumber}
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <div className="font-semibold text-white truncate">{crime.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {crime.category} · {crime.evidenceItems.length} Evidence logged
                      </div>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      <div className="text-slate-200 truncate">{crime.district}</div>
                      <div className="text-[11px] text-slate-500 truncate">{crime.locationAddress}</div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${severityBadge(crime.severity)}`}>
                        {crime.severity}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`font-semibold ${statusBadge(crime.status)}`}>
                        {crime.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 whitespace-nowrap">
                      <div>{crime.reportingOfficerName}</div>
                      {crime.leadInvestigatorName && (
                        <div className="text-[11px] text-slate-500">Lead: {crime.leadInvestigatorName}</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono whitespace-nowrap tabular-nums">
                      {new Date(crime.incidentDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectCrime(crime)}
                          title="Inspect case details"
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(crime)}
                          title="Edit case"
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete Case ${crime.caseNumber}? This action will be audited.`)) {
                              onDeleteCrime(crime.id);
                            }
                          }}
                          title="Delete case"
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Crime Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">
                {editingCrime ? `Modify Incident File: ${editingCrime.caseNumber}` : 'Register New Crime Incident'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Case Number</label>
                  <input
                    type="text"
                    required
                    value={formData.caseNumber}
                    onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Incident Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CrimeCategory })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Incident Title / Descriptor</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commercial District Armed Robbery"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Severity Level</label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as CrimeSeverity })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {SEVERITIES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as CrimeStatus })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Incident Timestamp</label>
                  <input
                    type="datetime-local"
                    value={formData.incidentDate}
                    onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Police District / Sector</label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {DISTRICTS.map(d => (
                      <option key={d.id} value={d.name}>{d.name} ({d.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Physical Location Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 520 Commercial Way, Sector B"
                    value={formData.locationAddress}
                    onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Reporting Officer</label>
                  <input
                    type="text"
                    value={formData.reportingOfficerName}
                    onChange={(e) => setFormData({ ...formData, reportingOfficerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Lead Investigator Assigned</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.leadInvestigatorName}
                    onChange={(e) => setFormData({ ...formData, leadInvestigatorName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Incident Narrative & Findings</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail primary events, tactical response, entry vectors, and initial evidence gathered..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Evidence Items Logged (1 item per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. CCTV tape backup&#10;Ballistic casing #4&#10;Encrypted phone"
                  value={formData.evidenceItems}
                  onChange={(e) => setFormData({ ...formData, evidenceItems: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              {/* Link supporting entities */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Link Associated Suspects
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-950 border border-slate-800 rounded-lg">
                  {suspects.map(s => {
                    const isSelected = formData.suspectIds.includes(s.id);
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => {
                          const updated = isSelected 
                            ? formData.suspectIds.filter(id => id !== s.id)
                            : [...formData.suspectIds, s.id];
                          setFormData({ ...formData, suspectIds: updated });
                        }}
                        className={`text-left p-2 rounded text-xs flex items-center justify-between border cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="truncate">{s.fullName} ({s.alias})</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-500 transition-colors font-medium shadow-sm cursor-pointer"
                >
                  {editingCrime ? 'Save Updates' : 'File Incident Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Case Details Inspector Modal */}
      {selectedCrimeDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-blue-400 font-bold">
                    {selectedCrimeDetail.caseNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${severityBadge(selectedCrimeDetail.severity)}`}>
                    {selectedCrimeDetail.severity}
                  </span>
                  <span className={`text-xs font-semibold ${statusBadge(selectedCrimeDetail.status)}`}>
                    ● {selectedCrimeDetail.status}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  {selectedCrimeDetail.title}
                </h2>
              </div>
              <button
                onClick={onClearSelectedCrime}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-6 text-xs">
              {/* Location & Officer metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div>
                  <span className="text-slate-500 block">District</span>
                  <span className="text-slate-200 font-medium">{selectedCrimeDetail.district}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Location Address</span>
                  <span className="text-slate-200 font-medium">{selectedCrimeDetail.locationAddress}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Lead Investigator</span>
                  <span className="text-slate-200 font-medium">{selectedCrimeDetail.leadInvestigatorName || 'Unassigned'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Incident Date</span>
                  <span className="text-slate-200 font-mono">
                    {new Date(selectedCrimeDetail.incidentDate).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Summary Narrative */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Investigative Narrative
                </h3>
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-300 leading-relaxed text-sm">
                  {selectedCrimeDetail.summary}
                </div>
              </div>

              {/* Evidence Vault Chain */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Evidence Vault & Property Chain ({selectedCrimeDetail.evidenceItems.length})
                </h3>
                {selectedCrimeDetail.evidenceItems.length === 0 ? (
                  <p className="text-slate-500 italic">No evidence items logged yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCrimeDetail.evidenceItems.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/70 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="text-slate-300 truncate font-mono text-[11px]">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Linked Suspects */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Linked Suspects & Persons of Interest
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {suspects
                    .filter(s => selectedCrimeDetail.suspectIds.includes(s.id) || s.linkedCrimeIds.includes(selectedCrimeDetail.id))
                    .map(s => (
                      <div key={s.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">{s.fullName}</div>
                          <div className="text-[11px] text-slate-400">Alias: {s.alias} · Status: {s.status}</div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/50 text-rose-400 border border-rose-900/40">
                          {s.threatLevel}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    const printText = `CRIME CASE DOSSIER\nCase ID: ${selectedCrimeDetail.caseNumber}\nTitle: ${selectedCrimeDetail.title}\nSeverity: ${selectedCrimeDetail.severity}\nStatus: ${selectedCrimeDetail.status}\nDistrict: ${selectedCrimeDetail.district}\nAddress: ${selectedCrimeDetail.locationAddress}\nNarrative:\n${selectedCrimeDetail.summary}\nEvidence:\n${selectedCrimeDetail.evidenceItems.join('\n')}`;
                    const blob = new Blob([printText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedCrimeDetail.caseNumber}_Dossier.txt`;
                    a.click();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Dossier (TXT)</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClearSelectedCrime();
                      handleOpenEditModal(selectedCrimeDetail);
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-500 font-medium transition-colors cursor-pointer"
                  >
                    Edit Case
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
