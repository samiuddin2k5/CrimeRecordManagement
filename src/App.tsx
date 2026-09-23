import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Layout } from './components/layout/Layout';
import { NavItemKey } from './components/layout/Sidebar';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { CrimesPage } from './components/crimes/CrimesPage';
import { SuspectsPage } from './components/suspects/SuspectsPage';
import { VictimsPage } from './components/victims/VictimsPage';
import { WitnessesPage } from './components/witnesses/WitnessesPage';
import { InvestigationsPage } from './components/investigations/InvestigationsPage';
import { CrimeHeatmapPage } from './components/heatmap/CrimeHeatmapPage';
import { DatabaseConfigModal } from './components/modals/DatabaseConfigModal';
import { DataService } from './lib/supabase';
import { Crime, Suspect, Victim, Witness, Investigation } from './types';

const MainApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Navigation
  const [currentTab, setCurrentTab] = useState<NavItemKey>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Primary Data State
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [suspects, setSuspects] = useState<Suspect[]>([]);
  const [victims, setVictims] = useState<Victim[]>([]);
  const [witnesses, setWitnesses] = useState<Witness[]>([]);
  const [investigations, setInvestigations] = useState<Investigation[]>([]);

  // Modals & Selection
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isNewCrimeModalOpen, setIsNewCrimeModalOpen] = useState(false);
  const [selectedCrimeDetail, setSelectedCrimeDetail] = useState<Crime | null>(null);

  // Load data function
  const loadData = async () => {
    try {
      const [crimesData, suspectsData, victimsData, witnessesData, invData] = await Promise.all([
        DataService.getCrimes(),
        DataService.getSuspects(),
        DataService.getVictims(),
        DataService.getWitnesses(),
        DataService.getInvestigations(),
      ]);
      setCrimes(crimesData);
      setSuspects(suspectsData);
      setVictims(victimsData);
      setWitnesses(witnessesData);
      setInvestigations(invData);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-3" />
        <span className="text-xs font-mono tracking-widest uppercase">Connecting to Law Enforcement Registry...</span>
      </div>
    );
  }

  // If officer is not logged in, render authentic AuthPage (matching uploaded image!)
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // CRUD Handlers for Crimes
  const handleAddCrime = async (crimeData: Omit<Crime, 'id' | 'updatedAt'>): Promise<Crime> => {
    const created = await DataService.addCrime(crimeData);
    await loadData();
    return created;
  };

  const handleUpdateCrime = async (id: string, updates: Partial<Crime>): Promise<Crime | null> => {
    const updated = await DataService.updateCrime(id, updates);
    await loadData();
    if (selectedCrimeDetail && selectedCrimeDetail.id === id) {
      setSelectedCrimeDetail(updated);
    }
    return updated;
  };

  const handleDeleteCrime = async (id: string): Promise<boolean> => {
    const success = await DataService.deleteCrime(id);
    await loadData();
    if (selectedCrimeDetail && selectedCrimeDetail.id === id) {
      setSelectedCrimeDetail(null);
    }
    return success;
  };

  // CRUD Handlers for Suspects
  const handleAddSuspect = async (suspectData: Omit<Suspect, 'id' | 'createdAt'>): Promise<Suspect> => {
    const created = await DataService.addSuspect(suspectData);
    await loadData();
    return created;
  };

  const handleUpdateSuspect = async (id: string, updates: Partial<Suspect>): Promise<Suspect | null> => {
    const updated = await DataService.updateSuspect(id, updates);
    await loadData();
    return updated;
  };

  const handleDeleteSuspect = async (id: string): Promise<boolean> => {
    const success = await DataService.deleteSuspect(id);
    await loadData();
    return success;
  };

  // CRUD Handlers for Victims
  const handleAddVictim = async (victimData: Omit<Victim, 'id' | 'createdAt'>): Promise<Victim> => {
    const created = await DataService.addVictim(victimData);
    await loadData();
    return created;
  };

  const handleUpdateVictim = async (id: string, updates: Partial<Victim>): Promise<Victim | null> => {
    const updated = await DataService.updateVictim(id, updates);
    await loadData();
    return updated;
  };

  const handleDeleteVictim = async (id: string): Promise<boolean> => {
    const success = await DataService.deleteVictim(id);
    await loadData();
    return success;
  };

  // CRUD Handlers for Witnesses
  const handleAddWitness = async (witnessData: Omit<Witness, 'id' | 'createdAt'>): Promise<Witness> => {
    const created = await DataService.addWitness(witnessData);
    await loadData();
    return created;
  };

  const handleUpdateWitness = async (id: string, updates: Partial<Witness>): Promise<Witness | null> => {
    const updated = await DataService.updateWitness(id, updates);
    await loadData();
    return updated;
  };

  const handleDeleteWitness = async (id: string): Promise<boolean> => {
    const success = await DataService.deleteWitness(id);
    await loadData();
    return success;
  };

  // Handlers for Investigations
  const handleAddInvestigation = async (invData: Omit<Investigation, 'id'>): Promise<Investigation> => {
    const created = await DataService.addInvestigation(invData);
    await loadData();
    return created;
  };

  const handleUpdateInvestigation = async (id: string, updates: Partial<Investigation>): Promise<Investigation | null> => {
    const updated = await DataService.updateInvestigation(id, updates);
    await loadData();
    return updated;
  };

  // Handle case inspection from dashboard or heatmap
  const handleInspectCrime = (crime: Crime) => {
    setSelectedCrimeDetail(crime);
    setCurrentTab('crimes');
  };

  // Count summaries for sidebar badges
  const counts = {
    crimes: crimes.length,
    suspects: suspects.length,
    victims: victims.length,
    witnesses: witnesses.length,
    investigations: investigations.length,
  };

  return (
    <Layout
      currentTab={currentTab}
      onSelectTab={(tab) => {
        if (tab === 'settings') {
          setIsDbModalOpen(true);
        } else {
          setCurrentTab(tab);
        }
      }}
      onOpenNewCrimeModal={() => {
        setCurrentTab('crimes');
        setIsNewCrimeModalOpen(true);
      }}
      onOpenDbConfig={() => setIsDbModalOpen(true)}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      counts={counts}
    >
      {currentTab === 'dashboard' && (
        <DashboardPage
          crimes={crimes}
          suspects={suspects}
          investigations={investigations}
          onNavigateTab={(tab) => setCurrentTab(tab)}
          onSelectCrime={handleInspectCrime}
          onOpenNewCrimeModal={() => {
            setCurrentTab('crimes');
            setIsNewCrimeModalOpen(true);
          }}
        />
      )}

      {currentTab === 'crimes' && (
        <CrimesPage
          crimes={crimes}
          suspects={suspects}
          victims={victims}
          witnesses={witnesses}
          onAddCrime={handleAddCrime}
          onUpdateCrime={handleUpdateCrime}
          onDeleteCrime={handleDeleteCrime}
          selectedCrimeDetail={selectedCrimeDetail}
          onClearSelectedCrime={() => setSelectedCrimeDetail(null)}
          onSelectCrime={(c) => setSelectedCrimeDetail(c)}
        />
      )}

      {currentTab === 'suspects' && (
        <SuspectsPage
          suspects={suspects}
          crimes={crimes}
          onAddSuspect={handleAddSuspect}
          onUpdateSuspect={handleUpdateSuspect}
          onDeleteSuspect={handleDeleteSuspect}
        />
      )}

      {currentTab === 'victims' && (
        <VictimsPage
          victims={victims}
          crimes={crimes}
          onAddVictim={handleAddVictim}
          onUpdateVictim={handleUpdateVictim}
          onDeleteVictim={handleDeleteVictim}
        />
      )}

      {currentTab === 'witnesses' && (
        <WitnessesPage
          witnesses={witnesses}
          crimes={crimes}
          onAddWitness={handleAddWitness}
          onUpdateWitness={handleUpdateWitness}
          onDeleteWitness={handleDeleteWitness}
        />
      )}

      {currentTab === 'investigations' && (
        <InvestigationsPage
          investigations={investigations}
          crimes={crimes}
          onAddInvestigation={handleAddInvestigation}
          onUpdateInvestigation={handleUpdateInvestigation}
        />
      )}

      {currentTab === 'heatmap' && (
        <CrimeHeatmapPage
          crimes={crimes}
          onSelectCrime={handleInspectCrime}
        />
      )}

      {/* Database & Supabase Modal */}
      <DatabaseConfigModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        onDataRefresh={loadData}
      />
    </Layout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
