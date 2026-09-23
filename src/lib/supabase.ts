import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LocalStorageDB } from './localStorage';
import { Crime, Suspect, Victim, Witness, Investigation, Officer } from '../types';

interface SupabaseConfig {
  url: string;
  anonKey: string;
}

const SUPABASE_CONFIG_KEY = 'police_rms_supabase_config';

export function getStoredSupabaseConfig(): SupabaseConfig | null {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey };
  }
  const stored = localStorage.getItem(SUPABASE_CONFIG_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.url && parsed.anonKey) return parsed;
    } catch {
      return null;
    }
  }
  return null;
}

export function saveSupabaseConfig(config: SupabaseConfig | null): void {
  if (config) {
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
  } else {
    localStorage.removeItem(SUPABASE_CONFIG_KEY);
  }
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const cfg = getStoredSupabaseConfig();
  if (!cfg) return null;
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(cfg.url, cfg.anonKey);
    } catch {
      supabaseInstance = null;
    }
  }
  return supabaseInstance;
}

export const isSupabaseConfigured = (): boolean => {
  return Boolean(getStoredSupabaseConfig()?.url);
};

// Unified Data Access API with automatic fallback
export const DataService = {
  isCloudMode: isSupabaseConfigured,

  // CRIMES
  async getCrimes(): Promise<Crime[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from('crimes').select('*').order('incidentDate', { ascending: false });
        if (!error && data && data.length > 0) return data as Crime[];
      } catch {
        // Fall back to local
      }
    }
    return LocalStorageDB.getCrimes();
  },

  async addCrime(crime: Omit<Crime, 'id' | 'updatedAt'>): Promise<Crime> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const newRecord = { ...crime, updatedAt: new Date().toISOString() };
        const { data, error } = await client.from('crimes').insert([newRecord]).select().single();
        if (!error && data) return data as Crime;
      } catch {
        // Fall back to local
      }
    }
    return LocalStorageDB.addCrime(crime);
  },

  async updateCrime(id: string, updates: Partial<Crime>): Promise<Crime | null> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const payload = { ...updates, updatedAt: new Date().toISOString() };
        const { data, error } = await client.from('crimes').update(payload).eq('id', id).select().single();
        if (!error && data) return data as Crime;
      } catch {
        // Fall back
      }
    }
    return LocalStorageDB.updateCrime(id, updates);
  },

  async deleteCrime(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { error } = await client.from('crimes').delete().eq('id', id);
        if (!error) return true;
      } catch {
        // Fall back
      }
    }
    return LocalStorageDB.deleteCrime(id);
  },

  // SUSPECTS
  async getSuspects(): Promise<Suspect[]> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from('suspects').select('*').order('createdAt', { ascending: false });
        if (!error && data && data.length > 0) return data as Suspect[];
      } catch {
        // Fall back
      }
    }
    return LocalStorageDB.getSuspects();
  },

  async addSuspect(suspect: Omit<Suspect, 'id' | 'createdAt'>): Promise<Suspect> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from('suspects').insert([suspect]).select().single();
        if (!error && data) return data as Suspect;
      } catch {
        // Fall back
      }
    }
    return LocalStorageDB.addSuspect(suspect);
  },

  async updateSuspect(id: string, updates: Partial<Suspect>): Promise<Suspect | null> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from('suspects').update(updates).eq('id', id).select().single();
        if (!error && data) return data as Suspect;
      } catch {
        // Fall back
      }
    }
    return LocalStorageDB.updateSuspect(id, updates);
  },

  async deleteSuspect(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { error } = await client.from('suspects').delete().eq('id', id);
        if (!error) return true;
      } catch {
        // Fall back
      }
    }
    return LocalStorageDB.deleteSuspect(id);
  },

  // VICTIMS
  async getVictims(): Promise<Victim[]> {
    return LocalStorageDB.getVictims();
  },
  async addVictim(victim: Omit<Victim, 'id' | 'createdAt'>): Promise<Victim> {
    return LocalStorageDB.addVictim(victim);
  },
  async updateVictim(id: string, updates: Partial<Victim>): Promise<Victim | null> {
    return LocalStorageDB.updateVictim(id, updates);
  },
  async deleteVictim(id: string): Promise<boolean> {
    return LocalStorageDB.deleteVictim(id);
  },

  // WITNESSES
  async getWitnesses(): Promise<Witness[]> {
    return LocalStorageDB.getWitnesses();
  },
  async addWitness(witness: Omit<Witness, 'id' | 'createdAt'>): Promise<Witness> {
    return LocalStorageDB.addWitness(witness);
  },
  async updateWitness(id: string, updates: Partial<Witness>): Promise<Witness | null> {
    return LocalStorageDB.updateWitness(id, updates);
  },
  async deleteWitness(id: string): Promise<boolean> {
    return LocalStorageDB.deleteWitness(id);
  },

  // INVESTIGATIONS
  async getInvestigations(): Promise<Investigation[]> {
    return LocalStorageDB.getInvestigations();
  },
  async addInvestigation(inv: Omit<Investigation, 'id'>): Promise<Investigation> {
    return LocalStorageDB.addInvestigation(inv);
  },
  async updateInvestigation(id: string, updates: Partial<Investigation>): Promise<Investigation | null> {
    return LocalStorageDB.updateInvestigation(id, updates);
  },
};
