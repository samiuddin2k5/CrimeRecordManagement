import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  AlertOctagon, 
  ShieldAlert, 
  Edit2, 
  Trash2, 
  Eye, 
  X, 
  MapPin, 
  FileWarning, 
  CheckCircle2, 
  Radio
} from 'lucide-react';
import { Suspect, ThreatLevel, SuspectStatus, Crime } from '../../types';

interface SuspectsPageProps {
  suspects: Suspect[];
  crimes: Crime[];
  onAddSuspect: (suspect: Omit<Suspect, 'id' | 'createdAt'>) => Promise<Suspect>;
  onUpdateSuspect: (id: string, updates: Partial<Suspect>) => Promise<Suspect | null>;
  onDeleteSuspect: (id: string) => Promise<boolean>;
}

const THREAT_LEVELS: ThreatLevel[] = ['Critical', 'Severe', 'Elevated', 'Guarded', 'Low'];
const STATUSES: SuspectStatus[] = [
  'Wanted',
  'Warrant Active',
  'In Custody',
  'Under Surveillance',
  'Released',
  'Acquitted',
];

export const SuspectsPage: React.FC<SuspectsPageProps> = ({
  suspects,
  crimes,
  onAddSuspect,
  onUpdateSuspect,
  onDeleteSuspect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterThreat, setFilterThreat] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSuspect, setEditingSuspect] = useState<Suspect | null>(null);
  const [viewingSuspect, setViewingSuspect] = useState<Suspect | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    alias: '',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    threatLevel: 'Severe' as ThreatLevel,
    status: 'Wanted' as SuspectStatus,
    primaryOffense: '',
    priorConvictions: 0,
    identifyingMarks: '',
    lastKnownLocation: '',
    notes: '',
    linkedCrimeIds: [] as string[],
  });

  const handleOpenAdd = () => {
    setEditingSuspect(null);
    setFormData({
      fullName: '',
      alias: '',
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      threatLevel: 'Severe',
      status: 'Wanted',
      primaryOffense: '',
      priorConvictions: 1,
      identifyingMarks: '',
      lastKnownLocation: '',
      notes: '',
      linkedCrimeIds: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Suspect) => {
    setEditingSuspect(s);
    setFormData({
      fullName: s.fullName,
      alias: s.alias,
      dateOfBirth: s.dateOfBirth,
      gender: s.gender,
      threatLevel: s.threatLevel,
      status: s.status,
      primaryOffense: s.primaryOffense,
      priorConvictions: s.priorConvictions,
      identifyingMarks: s.identifyingMarks,
      lastKnownLocation: s.lastKnownLocation,
      notes: s.notes,
      linkedCrimeIds: s.linkedCrimeIds || [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSuspect) {
      await onUpdateSuspect(editingSuspect.id, formData);
    } else {
      await onAddSuspect(formData);
    }
    setIsModalOpen(false);
  };

  const filteredSuspects = suspects.filter(s => {
    const matchesSearch = 
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.primaryOffense.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastKnownLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesThreat = filterThreat === 'All' || s.threatLevel === filterThreat;
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus;

    return matchesSearch && matchesThreat && matchesStatus;
  });

  const threatColor = (level: ThreatLevel) => {
    switch (level) {
      case 'Critical':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/60';
      case 'Severe':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
      case 'Elevated':
        return 'text-yellow-400 bg-yellow-950/60 border-yellow-800/60';
      case 'Guarded':
        return 'text-blue-400 bg-blue-950/60 border-blue-800/60';
      case 'Low':
        return 'text-slate-400 bg-slate-800/60 border-slate-700/60';
    }
  };

  const statusColor = (status: SuspectStatus) => {
    switch (status) {
      case 'Wanted':
        return 'text-rose-400 bg-rose-950/50 border-rose-800';
      case 'Warrant Active':
        return 'text-amber-400 bg-amber-950/50 border-amber-800';
      case 'In Custody':
        return 'text-emerald-400 bg-emerald-950/50 border-emerald-800';
      case 'Under Surveillance':
        return 'text-indigo-400 bg-indigo-950/50 border-indigo-800';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Suspects & Wanted Persons Dossiers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Criminal profiles, APB warrants, identifying marks, and criminal history records.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Suspect Dossier</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search suspect name, alias, offense, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterThreat}
            onChange={(e) => setFilterThreat(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Threat Levels</option>
            {THREAT_LEVELS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Custody Statuses</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Suspects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSuspects.map((suspect) => (
          <div
            key={suspect.id}
            className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            {/* Header info with mugshot */}
            <div className="p-5">
              <div className="flex items-start gap-4">
                {/* Mugshot Image Container with Zero-Broken-Image Policy */}
                <div className="w-20 h-24 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center relative">
                  {suspect.mugshotUrl ? (
                    <img
                      src={suspect.mugshotUrl}
                      alt={suspect.fullName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2 text-center text-slate-500">
                      <Users className="w-8 h-8 text-slate-600 mb-1" />
                      <span className="text-[9px] uppercase font-mono">No Photo</span>
                    </div>
                  )}
                  {suspect.status === 'Wanted' && (
                    <span className="absolute bottom-0 inset-x-0 bg-rose-600 text-white font-black text-[9px] text-center tracking-widest uppercase py-0.5">
                      WANTED
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase font-mono ${threatColor(suspect.threatLevel)}`}>
                      {suspect.threatLevel} Threat
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white truncate">
                    {suspect.fullName}
                  </h3>
                  <div className="text-xs text-blue-400 font-medium truncate">
                    Alias: "{suspect.alias || 'Unknown'}"
                  </div>
                  <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border text-slate-300">
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      suspect.status === 'In Custody' ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'
                    }`} />
                    {suspect.status}
                  </div>
                </div>
              </div>

              {/* Offenses and location */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Primary Offense</span>
                  <span className="text-slate-200 font-medium line-clamp-1">{suspect.primaryOffense}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 truncate max-w-[200px]">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{suspect.lastKnownLocation}</span>
                  </span>
                  <span className="font-mono tabular-nums text-slate-500 shrink-0">
                    {suspect.priorConvictions} Priors
                  </span>
                </div>
              </div>
            </div>

            {/* Card footer */}
            <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setViewingSuspect(suspect)}
                className="px-3 py-1.5 rounded text-xs font-medium text-blue-400 hover:text-white hover:bg-blue-600/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Full Dossier</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(suspect)}
                  className="p-1.5 text-slate-400 hover:text-amber-400 rounded transition-colors cursor-pointer"
                  title="Edit dossier"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete suspect record for ${suspect.fullName}?`)) {
                      onDeleteSuspect(suspect.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition-colors cursor-pointer"
                  title="Delete record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Suspect Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">
                {editingSuspect ? `Modify Suspect Profile: ${editingSuspect.fullName}` : 'Register New Suspect / Criminal Profile'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Street Alias / Moniker</label>
                  <input
                    type="text"
                    value={formData.alias}
                    placeholder='e.g. "The Ghost"'
                    onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Threat Level</label>
                  <select
                    value={formData.threatLevel}
                    onChange={(e) => setFormData({ ...formData, threatLevel: e.target.value as ThreatLevel })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {THREAT_LEVELS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Custody Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as SuspectStatus })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Primary Charge / Offense</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Armed Robbery with Aggravated Assault"
                  value={formData.primaryOffense}
                  onChange={(e) => setFormData({ ...formData, primaryOffense: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Prior Convictions Count</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.priorConvictions}
                    onChange={(e) => setFormData({ ...formData, priorConvictions: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Last Known Location / District</label>
                  <input
                    type="text"
                    value={formData.lastKnownLocation}
                    placeholder="e.g. Harbor Docks Warehouse Area"
                    onChange={(e) => setFormData({ ...formData, lastKnownLocation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Identifying Marks / Tattoos / Physical Characteristics</label>
                <input
                  type="text"
                  placeholder="e.g. Spider tattoo on right wrist, scar along left jawline"
                  value={formData.identifyingMarks}
                  onChange={(e) => setFormData({ ...formData, identifyingMarks: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Investigative Notes & Risk Analysis</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  placeholder="Tactical precautions, known affiliations, weapon tendencies..."
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
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
                  {editingSuspect ? 'Update Profile' : 'Register Suspect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Viewing Dossier Modal */}
      {viewingSuspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-20 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                  {viewingSuspect.mugshotUrl ? (
                    <img
                      src={viewingSuspect.mugshotUrl}
                      alt={viewingSuspect.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-[10px]">
                      NO PHOTO
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${threatColor(viewingSuspect.threatLevel)}`}>
                      {viewingSuspect.threatLevel} Threat
                    </span>
                    <span className="text-xs font-semibold text-rose-400">
                      ● {viewingSuspect.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">
                    {viewingSuspect.fullName}
                  </h2>
                  <div className="text-xs text-blue-400">
                    Alias: "{viewingSuspect.alias || 'None'}"
                  </div>
                </div>
              </div>
              <button onClick={() => setViewingSuspect(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Date of Birth</span>
                  <span className="text-slate-200 font-mono">{viewingSuspect.dateOfBirth}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Prior Convictions</span>
                  <span className="text-slate-200 font-mono">{viewingSuspect.priorConvictions} on record</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Last Known Location</span>
                  <span className="text-slate-200">{viewingSuspect.lastKnownLocation}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Identifying Marks</span>
                  <span className="text-slate-200">{viewingSuspect.identifyingMarks || 'None documented'}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                  Primary Offense & Charges
                </h4>
                <p className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-slate-200">
                  {viewingSuspect.primaryOffense}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                  Investigator Intelligence Notes
                </h4>
                <p className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-slate-300 leading-relaxed">
                  {viewingSuspect.notes || 'No confidential remarks registered.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => alert(`APB broadcast generated for ${viewingSuspect.fullName} (${viewingSuspect.alias}) across all tactical patrol units.`)}
                  className="px-3.5 py-1.5 rounded-lg text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/80 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Issue APB Warrant Alert</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const toEdit = viewingSuspect;
                    setViewingSuspect(null);
                    handleOpenEdit(toEdit);
                  }}
                  className="px-4 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-500 font-medium cursor-pointer"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
