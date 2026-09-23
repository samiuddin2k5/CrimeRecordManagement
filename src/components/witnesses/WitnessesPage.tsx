import React, { useState } from 'react';
import { 
  Eye, 
  Search, 
  Plus, 
  ShieldCheck, 
  ShieldAlert, 
  Edit2, 
  Trash2, 
  X, 
  FileText, 
  Phone,
  CheckCircle2
} from 'lucide-react';
import { Witness, Crime } from '../../types';

interface WitnessesPageProps {
  witnesses: Witness[];
  crimes: Crime[];
  onAddWitness: (witness: Omit<Witness, 'id' | 'createdAt'>) => Promise<Witness>;
  onUpdateWitness: (id: string, updates: Partial<Witness>) => Promise<Witness | null>;
  onDeleteWitness: (id: string) => Promise<boolean>;
}

export const WitnessesPage: React.FC<WitnessesPageProps> = ({
  witnesses,
  crimes,
  onAddWitness,
  onUpdateWitness,
  onDeleteWitness,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProtection, setFilterProtection] = useState<string>('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWitness, setEditingWitness] = useState<Witness | null>(null);
  const [viewingWitness, setViewingWitness] = useState<Witness | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    linkedCrimeId: crimes[0]?.id || '',
    protectionStatus: 'None' as 'None' | 'Requested' | 'Active Protection',
    credibilityRating: 'High' as 'High' | 'Moderate' | 'Questionable',
    statementSummary: '',
    interviewDate: new Date().toISOString().slice(0, 10),
    interviewingOfficer: 'Det. Marcus Vance',
  });

  const handleOpenAdd = () => {
    setEditingWitness(null);
    setFormData({
      fullName: '',
      contactNumber: '(555) 019-3388',
      linkedCrimeId: crimes[0]?.id || '',
      protectionStatus: 'None',
      credibilityRating: 'High',
      statementSummary: '',
      interviewDate: new Date().toISOString().slice(0, 10),
      interviewingOfficer: 'Det. Marcus Vance',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (w: Witness) => {
    setEditingWitness(w);
    setFormData({
      fullName: w.fullName,
      contactNumber: w.contactNumber,
      linkedCrimeId: w.linkedCrimeId,
      protectionStatus: w.protectionStatus,
      credibilityRating: w.credibilityRating,
      statementSummary: w.statementSummary,
      interviewDate: w.interviewDate,
      interviewingOfficer: w.interviewingOfficer,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWitness) {
      await onUpdateWitness(editingWitness.id, formData);
    } else {
      await onAddWitness(formData);
    }
    setIsModalOpen(false);
  };

  const filtered = witnesses.filter(w => {
    const matchesSearch = 
      w.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.statementSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.interviewingOfficer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProt = filterProtection === 'All' || w.protectionStatus === filterProtection;
    return matchesSearch && matchesProt;
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
            Witness Statements & Protection Program
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Deposition transcripts, credibility indices, and federal witness protection tracking.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Witness Statement</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search witness name, statement content, investigator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={filterProtection}
          onChange={(e) => setFilterProtection(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
        >
          <option value="All">All Protection Levels</option>
          <option value="None">None</option>
          <option value="Requested">Protection Requested</option>
          <option value="Active Protection">Active Witness Protection</option>
        </select>
      </div>

      {/* Witnesses Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Witness Name</th>
                <th className="px-5 py-3">Protection Status</th>
                <th className="px-5 py-3">Credibility</th>
                <th className="px-5 py-3">Associated Crime</th>
                <th className="px-5 py-3">Interview Officer</th>
                <th className="px-5 py-3">Interview Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                    No witness statements logged.
                  </td>
                </tr>
              ) : (
                filtered.map((witness) => (
                  <tr key={witness.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white">{witness.fullName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{witness.contactNumber}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border ${
                        witness.protectionStatus === 'Active Protection'
                          ? 'text-emerald-400 bg-emerald-950/50 border-emerald-800'
                          : witness.protectionStatus === 'Requested'
                          ? 'text-amber-400 bg-amber-950/50 border-amber-800'
                          : 'text-slate-400 bg-slate-800 border-slate-700'
                      }`}>
                        {witness.protectionStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`font-semibold ${
                        witness.credibilityRating === 'High'
                          ? 'text-blue-400'
                          : witness.credibilityRating === 'Moderate'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}>
                        {witness.credibilityRating}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 max-w-xs truncate">
                      {getCrimeTitle(witness.linkedCrimeId)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 whitespace-nowrap">
                      {witness.interviewingOfficer}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono tabular-nums whitespace-nowrap">
                      {witness.interviewDate}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingWitness(witness)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 rounded transition-colors cursor-pointer"
                          title="View statement transcript"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(witness)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 rounded transition-colors cursor-pointer"
                          title="Edit statement record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove statement from ${witness.fullName}?`)) {
                              onDeleteWitness(witness.id);
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

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">
                {editingWitness ? `Update Witness Record: ${editingWitness.fullName}` : 'Log Witness Deposition'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Witness Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone Contact</label>
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
                  <label className="block text-slate-300 font-medium mb-1">Protection Program</label>
                  <select
                    value={formData.protectionStatus}
                    onChange={(e) => setFormData({ ...formData, protectionStatus: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="None">None</option>
                    <option value="Requested">Protection Requested</option>
                    <option value="Active Protection">Active Protection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Credibility Rating</label>
                  <select
                    value={formData.credibilityRating}
                    onChange={(e) => setFormData({ ...formData, credibilityRating: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="High">High (Corroborated by physical evidence)</option>
                    <option value="Moderate">Moderate (Plausible observation)</option>
                    <option value="Questionable">Questionable (Inconsistent details)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Associated Crime</label>
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
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Interview Date</label>
                  <input
                    type="date"
                    value={formData.interviewDate}
                    onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Interviewing Officer</label>
                <input
                  type="text"
                  value={formData.interviewingOfficer}
                  onChange={(e) => setFormData({ ...formData, interviewingOfficer: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Witness Statement Summary</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Record key observations, suspect description, vehicles, timeline, verbatim quotes..."
                  value={formData.statementSummary}
                  onChange={(e) => setFormData({ ...formData, statementSummary: e.target.value })}
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
                  {editingWitness ? 'Save Statement' : 'File Deposition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Transcript Modal */}
      {viewingWitness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl p-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-blue-400 font-bold">WITNESS DEPOSITION</span>
                <h3 className="text-base font-bold text-white mt-0.5">{viewingWitness.fullName}</h3>
                <div className="text-xs text-slate-400 mt-1">
                  Conducted by {viewingWitness.interviewingOfficer} on {viewingWitness.interviewDate}
                </div>
              </div>
              <button onClick={() => setViewingWitness(null)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[11px]">Credibility Rating</span>
                  <span className="font-semibold text-blue-400">{viewingWitness.credibilityRating}</span>
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <div>
                  <span className="text-slate-500 block text-[11px]">Protection Program</span>
                  <span className="font-semibold text-emerald-400">{viewingWitness.protectionStatus}</span>
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <div>
                  <span className="text-slate-500 block text-[11px]">Case Ref</span>
                  <span className="font-mono text-slate-300">{getCrimeTitle(viewingWitness.linkedCrimeId)}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
                  Official Sworn Statement Transcript
                </h4>
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 leading-relaxed font-sans text-sm">
                  "{viewingWitness.statementSummary}"
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setViewingWitness(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
