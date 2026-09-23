import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar, NavItemKey } from './Sidebar';

interface LayoutProps {
  currentTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  onOpenNewCrimeModal: () => void;
  onOpenDbConfig: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  counts: {
    crimes: number;
    suspects: number;
    victims: number;
    witnesses: number;
    investigations: number;
  };
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewCrimeModal,
  onOpenDbConfig,
  searchQuery,
  onSearchChange,
  counts,
  children,
}) => {
  const titles: Record<NavItemKey, string> = {
    dashboard: 'Operational Command Dashboard',
    crimes: 'Incident & Case Repository',
    suspects: 'Suspect & Wanted Registry',
    victims: 'Victims Confidential Registry',
    witnesses: 'Witness Statements & Protection',
    investigations: 'Active Case Investigations',
    heatmap: 'Metropolitan Crime Intensity Heatmap',
    settings: 'Database & Supabase Connectivity',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        currentSection={titles[currentTab] || 'Records'}
        onOpenNewCrimeModal={onOpenNewCrimeModal}
        onOpenDbConfig={onOpenDbConfig}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
      <div className="flex flex-1">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={onSelectTab}
          counts={counts}
        />
        <main className="flex-1 min-w-0 p-6 lg:p-8 bg-slate-950 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
