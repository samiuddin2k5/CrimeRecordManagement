import React from 'react';
import { Shield, Plus, Database, LogOut, Search, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';

interface NavbarProps {
  currentSection: string;
  onOpenNewCrimeModal: () => void;
  onOpenDbConfig: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onOpenNewCrimeModal,
  onOpenDbConfig,
  searchQuery,
  onSearchChange,
}) => {
  const { officer, logout } = useAuth();
  const isCloud = isSupabaseConfigured();

  return (
    <header className="h-16 px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-20 sticky top-0">
      {/* Zone 1: Brand single text element wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
          <Shield className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-base tracking-tight">
            Crime Records System
          </span>
          <span className="text-slate-600 hidden sm:inline" aria-hidden="true">/</span>
          <span className="text-xs font-medium text-slate-400 hidden sm:inline">
            {currentSection}
          </span>
        </div>
      </div>

      {/* Center: Live Global Search */}
      <div className="hidden lg:flex items-center max-w-md w-full mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search cases, suspects, badge #, or evidence..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/40 transition-colors"
          />
        </div>
      </div>

      {/* Zone 3: Primary actions & Officer profile */}
      <div className="flex items-center gap-3">
        {/* Quick Database Mode Toggle */}
        <button
          onClick={onOpenDbConfig}
          title={isCloud ? "Supabase Cloud Connected" : "Local Storage Mode (Click to connect Supabase)"}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors cursor-pointer"
        >
          <Database className={`w-3.5 h-3.5 ${isCloud ? 'text-emerald-400' : 'text-blue-400'}`} />
          <span className="hidden md:inline">
            {isCloud ? 'Supabase' : 'Local Storage'}
          </span>
        </button>

        {/* New Crime Action Button */}
        <button
          onClick={onOpenNewCrimeModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Incident</span>
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-slate-800 hidden sm:block" />

        {/* Officer Profile Details */}
        {officer && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-white leading-tight">
                {officer.rank} {officer.name}
              </div>
              <div className="text-[11px] text-slate-400 font-mono tabular-nums leading-tight">
                {officer.badgeNumber} · {officer.department}
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-blue-400">
              {officer.name.split(' ').map(n => n[0]).join('')}
            </div>

            <button
              onClick={logout}
              title="Sign out of portal"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
