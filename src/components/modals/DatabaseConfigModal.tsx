import React, { useState } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  Server, 
  ShieldCheck,
  Key
} from 'lucide-react';
import { 
  getStoredSupabaseConfig, 
  saveSupabaseConfig, 
  isSupabaseConfigured 
} from '../../lib/supabase';
import { LocalStorageDB } from '../../lib/localStorage';

interface DatabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRefresh: () => void;
}

export const DatabaseConfigModal: React.FC<DatabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onDataRefresh,
}) => {
  const currentConfig = getStoredSupabaseConfig();
  const [url, setUrl] = useState(currentConfig?.url || '');
  const [anonKey, setAnonKey] = useState(currentConfig?.anonKey || '');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && anonKey.trim()) {
      saveSupabaseConfig({ url: url.trim(), anonKey: anonKey.trim() });
      setStatusMessage('Supabase configuration saved! The application will now attempt connection.');
    } else {
      saveSupabaseConfig(null);
      setStatusMessage('Switched back to Local Browser Storage mode.');
    }
    setTimeout(() => {
      onDataRefresh();
    }, 500);
  };

  const handleDisconnect = () => {
    saveSupabaseConfig(null);
    setUrl('');
    setAnonKey('');
    setStatusMessage('Supabase disconnected. System is operating on Local Storage persistence.');
    onDataRefresh();
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all crime, suspect, victim, witness, and investigation records to default simulated police data?')) {
      LocalStorageDB.resetToDefaultData();
      setStatusMessage('Police records reset to authoritative default dataset.');
      onDataRefresh();
    }
  };

  const handleExportBackup = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      officers: LocalStorageDB.getOfficers(),
      crimes: LocalStorageDB.getCrimes(),
      suspects: LocalStorageDB.getSuspects(),
      victims: LocalStorageDB.getVictims(),
      witnesses: LocalStorageDB.getWitnesses(),
      investigations: LocalStorageDB.getInvestigations(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const dlUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = dlUrl;
    a.download = `PoliceRMS_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const isConfigured = isSupabaseConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Database & Supabase Connectivity</h2>
              <p className="text-xs text-slate-400">Configure cloud persistence or manage local offline storage</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6 text-xs">
          {/* Active Mode Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isConfigured
              ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
              : 'bg-blue-950/30 border-blue-800/50 text-blue-300'
          }`}>
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-semibold text-white">
                  Current Mode: {isConfigured ? 'Supabase Cloud Database' : 'Local Browser Storage'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {isConfigured 
                    ? 'Records sync automatically with your remote Supabase instance.'
                    : 'Operating in high-speed local fallback mode with browser persistence.'}
                </div>
              </div>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold shrink-0 ${
              isConfigured ? 'bg-emerald-900/60 border-emerald-700' : 'bg-blue-900/60 border-blue-700'
            }`}>
              {isConfigured ? 'CONNECTED' : 'STANDALONE'}
            </span>
          </div>

          {statusMessage && (
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Supabase Credentials Form */}
          <form onSubmit={handleSaveConfig} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Supabase Cloud Credentials (Optional)</h3>
              {isConfigured && (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="text-rose-400 hover:text-rose-300 text-[11px] font-medium cursor-pointer"
                >
                  Disconnect Supabase
                </button>
              )}
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Project URL (`VITE_SUPABASE_URL`)</label>
              <input
                type="url"
                placeholder="https://your-project.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Anon / Public API Key (`VITE_SUPABASE_ANON_KEY`)</label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors cursor-pointer"
              >
                Save & Apply Credentials
              </button>
            </div>
          </form>

          {/* Database Utilities */}
          <div>
            <h3 className="font-semibold text-white mb-2">Local Data Management</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleExportBackup}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-white font-medium mb-1">
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Export JSON Backup</span>
                </div>
                <p className="text-[11px] text-slate-400">Download complete police registry backup file</p>
              </button>

              <button
                type="button"
                onClick={handleResetDefaults}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-white font-medium mb-1">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Restore Demo Dataset</span>
                </div>
                <p className="text-[11px] text-slate-400">Reset to default cases, suspects, and logs</p>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
