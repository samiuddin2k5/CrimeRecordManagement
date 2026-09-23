import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  HeartHandshake, 
  Eye, 
  FolderGit2, 
  MapPin, 
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export type NavItemKey = 
  | 'dashboard' 
  | 'crimes' 
  | 'suspects' 
  | 'victims' 
  | 'witnesses' 
  | 'investigations' 
  | 'heatmap' 
  | 'settings';

interface SidebarProps {
  currentTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  counts: {
    crimes: number;
    suspects: number;
    victims: number;
    witnesses: number;
    investigations: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, counts }) => {
  const navItems = [
    {
      key: 'dashboard' as NavItemKey,
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      key: 'crimes' as NavItemKey,
      label: 'Crime Records',
      icon: FileText,
      badge: counts.crimes,
    },
    {
      key: 'suspects' as NavItemKey,
      label: 'Suspects & Wanted',
      icon: Users,
      badge: counts.suspects,
    },
    {
      key: 'victims' as NavItemKey,
      label: 'Victims Registry',
      icon: HeartHandshake,
      badge: counts.victims,
    },
    {
      key: 'witnesses' as NavItemKey,
      label: 'Witness Statements',
      icon: Eye,
      badge: counts.witnesses,
    },
    {
      key: 'investigations' as NavItemKey,
      label: 'Active Investigations',
      icon: FolderGit2,
      badge: counts.investigations,
    },
    {
      key: 'heatmap' as NavItemKey,
      label: 'Geospatial Heatmap',
      icon: MapPin,
      badge: null,
    },
    {
      key: 'settings' as NavItemKey,
      label: 'Database & Sync',
      icon: SlidersHorizontal,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Navigation Category */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Law Enforcement Operations
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onSelectTab(item.key)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer group ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== null ? (
                    <span className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  ) : isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-slate-300">Station 04 Dispatch</span>
          <span className="text-[10px] text-emerald-400 font-mono">ENCRYPTED</span>
        </div>
        <p className="text-slate-400 leading-normal text-[11px]">
          Metropolitan Police Central Database. All access is audited and logged.
        </p>
      </div>
    </aside>
  );
};
