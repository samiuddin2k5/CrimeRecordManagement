import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Search, 
  Plus, 
  ShieldCheck, 
  ShieldAlert, 
  Edit2, 
  Trash2, 
  X, 
  Phone, 
  UserCheck
} from 'lucide-react';
import { Victim, Crime } from '../../types';

interface VictimsPageProps {
  victims: Victim[];
  crimes: Crime[];
  onAddVictim: (victim: Omit<Victim, 'id' | 'createdAt'>) => Promise<Victim>;
  onUpdateVictim: (id: string, updates: Partial<Victim>) => Promise<Victim | null>;
  onDeleteVictim: (id: string) => Promise<boolean>;
}

export const VictimsPage: React.FC<VictimsPageProps> = ({
  victims,
  crimes,
  onAddVictim,
  onUpdateVictim,
  onDeleteVictim,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterConfidentiality, setFilterConfidentiality] = useState<string>('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVictim, setEditingVictim] = useState<Victim | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    age: 30,
    gender: 'Female',
    contactNumber: '',
    confidentiality: 'Protected' as 'Standard' | 'Protected' | 'Sealed',
    injuryReported: false,
    advocateAssigned: '',
    statementGiven: true,
    linkedCrimeId: crimes[0]?.id || '',
    notes: '',
  });

  const handleOpenAdd = () => {
    setEditingVictim(null);
    setFormData({
      fullName: '',
      age: 32,
      gender: 'Female',
      contactNumber: '(555) 010-0000',
      confidentiality: 'Protected',
      injuryReported: false,
      advocateAssigned: 'Victim Support Services Unit 2',
      statementGiven: true,
      linkedCrimeId: crimes[0]?.id || '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Victim) => {
    setEditingVictim(v);
    setFormData({
      fullName: v.fullName,
      age: v.age,
      gender: v.gender,
      contactNumber: v.contactNumber,
      confidentiality: v.confidentiality,
      injuryReported: v.injuryReported,
      advocateAssigned: v.advocateAssigned || '',
      statementGiven: v.statementGiven,
      linkedCrimeId: v.linkedCrimeId,
      notes: v.notes,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVictim) {
      await onUpdateVictim(editingVictim.id, formData);
    } else {
      await onAddVictim(formData);
    }
    setIsModalOpen(false);
  };

  const filtered = victims.filter(v => {
    const matchesSearch = 
      v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.contactNumber.includes(searchTerm) ||
      (v.advocateAssigned && v.advocateAssigned.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesConf = filterConfidentiality === 'All' || v.confidentiality === filterConfidentiality;
    return matchesSearch && matchesConf;
  });

  const getCrimeTitle = (id: string) => {
    const found = crimes.find(c => c.id === id);
    return found ? `${found.caseNumber} - ${found.title}` : 'Unlinked Case';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Victims Confidential Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Protected privacy records, assigned victim advocates, statements, and medical injury disclosures.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Victim Record</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search victim name, phone, or advocate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={filterConfidentiality}
          onChange={(e) => setFilterConfidentiality(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
        >
          <option value="All">All Confidentiality Levels</option>
          <option value="Standard">Standard</option>
          <option value="Protected">Protected</option>
          <option value="Sealed">Sealed (Restricted)</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Victim Name</th>
                <th className="px-5 py-3">Confidentiality</th>
                <th className="px-5 py-3">Associated Crime Case</th>
                <th className="px-5 py-3">Assigned Advocate</th>
                <th className="px-5 py-3">Medical Injury</th>
                <th className="px-5 py-3">Statement Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                    No victim records found.
                  </td>
                </tr>
              ) : (
                filtered.map((victim) => (
                  <tr key={victim.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white">{victim.fullName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{victim.contactNumber}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border ${
                        victim.confidentiality === 'Sealed'
                          ? 'text-rose-400 bg-rose-950/50 border-rose-800'
                          : victim.confidentiality === 'Protected'
                          ? 'text-blue-400 bg-blue-950/50 border-blue-800'
                          : 'text-slate-400 bg-slate-800 border-slate-700'
                      }`}>
                        {victim.confidentiality}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 max-w-xs truncate">
                      {getCrimeTitle(victim.linkedCrimeId)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 whitespace-nowrap">
                      {victim.advocateAssigned || 'None assigned'}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {victim.injuryReported ? (
                        <span className="text-rose-400 font-medium">Yes - Documented</span>
                      ) : (
                        <span className="text-slate-500">No physical injury</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {victim.statementGiven ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-medium">
                          <UserCheck className="w-3.5 h-3.5" /> Filed
                        </span>
                      ) : (
                        <span className="text-amber-400 font-medium">Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(victim)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 rounded transition-colors cursor-pointer"
                          title="Edit victim details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove victim record for ${victim.fullName}?`)) {
                              onDeleteVictim(victim.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition-colors cursor-pointer"
                          title="Delete record"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">
                {editingVictim ? `Update Record: ${editingVictim.fullName}` : 'Register Victim Support Record'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Full Legal Name / Entity</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Confidentiality Protection</label>
                  <select
                    value={formData.confidentiality}
                    onChange={(e) => setFormData({ ...formData, confidentiality: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Standard">Standard (Internal Police Access)</option>
                    <option value="Protected">Protected (Restricted Access)</option>
                    <option value="Sealed">Sealed (Judicial Court Order)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Associated Crime Case</label>
                  <select
                    value={formData.linkedCrimeId}
                    onChange={(e) => setFormData({ ...formData, linkedCrimeId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {crimes.map(c => (
                      <option key={c.id} value={c.id}>{c.caseNumber} - {c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Assigned Victim Advocate</label>
                <input
                  type="text"
                  placeholder="e.g. Officer Clara Higgins"
                  value={formData.advocateAssigned}
                  onChange={(e) => setFormData({ ...formData, advocateAssigned: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-6 p-3 rounded-lg bg-slate-950 border border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.injuryReported}
                    onChange={(e) => setFormData({ ...formData, injuryReported: e.target.checked })}
                    className="rounded border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>Injury Reported</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.statementGiven}
                    onChange={(e) => setFormData({ ...formData, statementGiven: e.target.checked })}
                    className="rounded border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <span>Official Statement Filed</span>
                </label>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Support Case Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Support requirements, safe shelter status, contact restrictions..."
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
                  {editingVictim ? 'Save Updates' : 'Register Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
