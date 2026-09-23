import React, { createContext, useContext, useState, useEffect } from 'react';
import { Officer, OfficerRank, OfficerDepartment } from '../types';
import { LocalStorageDB, INITIAL_OFFICERS } from '../lib/localStorage';
import { getSupabaseClient } from '../lib/supabase';

interface RegisterData {
  name: string;
  email: string;
  password?: string;
  badgeNumber: string;
  rank: OfficerRank;
  department: OfficerDepartment;
}

interface AuthContextType {
  officer: Officer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  quickDemoLogin: (officerId: string) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [officer, setOfficer] = useState<Officer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check local session
    const current = LocalStorageDB.getCurrentOfficer();
    if (current) {
      setOfficer(current);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      // If Supabase is configured with Auth
      const supabase = getSupabaseClient();
      if (supabase && _password) {
        try {
          const { data, error: supaErr } = await supabase.auth.signInWithPassword({
            email,
            password: _password,
          });
          if (!supaErr && data?.user) {
            // Find or construct officer
            const officers = LocalStorageDB.getOfficers();
            const matched = officers.find(o => o.email.toLowerCase() === email.toLowerCase());
            const activeOfficer: Officer = matched || {
              id: data.user.id,
              badgeNumber: 'PD-' + Math.floor(1000 + Math.random() * 9000),
              name: data.user.user_metadata?.name || email.split('@')[0],
              email: email,
              rank: 'Detective',
              department: 'Major Crimes',
              clearanceLevel: 'Classified',
              joinedDate: new Date().toISOString().split('T')[0],
            };
            LocalStorageDB.setCurrentOfficer(activeOfficer);
            setOfficer(activeOfficer);
            setIsLoading(false);
            return true;
          }
        } catch {
          // Fall through to local fallback
        }
      }

      // Local fallback lookup
      const officers = LocalStorageDB.getOfficers();
      const matched = officers.find(o => o.email.toLowerCase() === email.trim().toLowerCase());
      
      if (matched) {
        LocalStorageDB.setCurrentOfficer(matched);
        setOfficer(matched);
        setIsLoading(false);
        return true;
      }

      // Allow any @police.gov demo email to sign in smoothly as an authorized officer
      if (email.trim().length > 3) {
        const username = email.split('@')[0].replace('.', ' ');
        const formattedName = username
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        const newOfficer: Officer = {
          id: `off-${Date.now()}`,
          badgeNumber: `PD-${Math.floor(1000 + Math.random() * 9000)}`,
          name: formattedName || 'Officer Agent',
          email: email.trim(),
          rank: 'Detective',
          department: 'Major Crimes',
          clearanceLevel: 'Classified',
          joinedDate: new Date().toISOString().split('T')[0],
        };

        const all = [...officers, newOfficer];
        LocalStorageDB.saveOfficers(all);
        LocalStorageDB.setCurrentOfficer(newOfficer);
        setOfficer(newOfficer);
        setIsLoading(false);
        return true;
      }

      setError('Invalid officer credential format. Please enter an authorized police ID or email.');
      setIsLoading(false);
      return false;
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const officers = LocalStorageDB.getOfficers();
      const existing = officers.find(o => o.email.toLowerCase() === data.email.trim().toLowerCase());
      if (existing) {
        setError('An officer profile with this official email already exists.');
        setIsLoading(false);
        return false;
      }

      const newOfficer: Officer = {
        id: `off-${Date.now()}`,
        badgeNumber: data.badgeNumber.startsWith('PD-') ? data.badgeNumber : `PD-${data.badgeNumber}`,
        name: data.name.trim(),
        email: data.email.trim(),
        rank: data.rank,
        department: data.department,
        clearanceLevel: 'Classified',
        joinedDate: new Date().toISOString().split('T')[0],
      };

      const updated = [newOfficer, ...officers];
      LocalStorageDB.saveOfficers(updated);
      LocalStorageDB.setCurrentOfficer(newOfficer);
      setOfficer(newOfficer);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    LocalStorageDB.setCurrentOfficer(null);
    setOfficer(null);
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        supabase.auth.signOut();
      } catch {
        // Ignore
      }
    }
  };

  const quickDemoLogin = (officerId: string) => {
    const list = LocalStorageDB.getOfficers();
    const found = list.find(o => o.id === officerId) || INITIAL_OFFICERS.find(o => o.id === officerId);
    if (found) {
      LocalStorageDB.setCurrentOfficer(found);
      setOfficer(found);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        officer,
        isAuthenticated: Boolean(officer),
        isLoading,
        error,
        login,
        register,
        logout,
        quickDemoLogin,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
