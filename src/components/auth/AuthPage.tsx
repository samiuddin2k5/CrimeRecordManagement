import React, { useState } from 'react';
import { Shield, Mail, Lock, User, Hash, Briefcase, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { OfficerRank, OfficerDepartment } from '../../types';
import bgImage from '../../assets/images/police_forensics_bg_1790191940728.jpg';

const RANKS: OfficerRank[] = [
  'Detective',
  'Senior Detective',
  'Inspector',
  'Chief Inspector',
  'Captain',
  'Forensic Analyst',
  'Sergeant',
];

const DEPARTMENTS: OfficerDepartment[] = [
  'Major Crimes',
  'Homicide',
  'Cybercrime & Digital Forensics',
  'Narcotics & Vice',
  'Financial Fraud',
  'Special Investigations',
  'Patrol & Tactical',
];

export const AuthPage: React.FC = () => {
  const { login, register, quickDemoLogin, error, clearError } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [email, setEmail] = useState('officer@police.gov');
  const [password, setPassword] = useState('MetroPolice2026!');
  const [name, setName] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [rank, setRank] = useState<OfficerRank>('Detective');
  const [department, setDepartment] = useState<OfficerDepartment>('Major Crimes');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);

    if (isRegistering) {
      if (!name.trim() || !badgeNumber.trim()) {
        setIsSubmitting(false);
        return;
      }
      await register({
        name,
        email,
        badgeNumber,
        rank,
        department,
        password,
      });
    } else {
      await login(email, password);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 py-8 select-none">
      {/* Cinematic Cyber-Forensics Background with exact atmosphere */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      />
      {/* Dark vignette and ambient cyan-blue overlay scrim */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.7)_100%)] pointer-events-none" />

      {/* Main Glassmorphic Container matching the provided reference image */}
      <div className="relative z-10 w-full max-w-[460px] mx-auto">
        <div className="backdrop-blur-xl bg-slate-900/65 border border-blue-400/20 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(59,130,246,0.15)] transition-all">
          
          {/* Top Shield Emblem */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="w-16 h-16 rounded-full bg-blue-600/25 border border-blue-400/50 flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.5)] mb-4">
              <Shield className="w-8 h-8 text-blue-400 stroke-[2.2]" />
            </div>
            
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Crime Records System
            </h1>
            <p className="text-sm font-medium text-blue-200/70 mt-1">
              Officer Portal Access
            </p>
          </div>

          {/* Error notice if any */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Officer Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Miller"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Badge Number
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="PD-8821"
                        value={badgeNumber}
                        onChange={(e) => setBadgeNumber(e.target.value)}
                        className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Rank
                    </label>
                    <select
                      value={rank}
                      onChange={(e) => setRank(e.target.value as OfficerRank)}
                      className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    >
                      {RANKS.map((r) => (
                        <option key={r} value={r} className="bg-slate-900 text-white">
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Assigned Department
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value as OfficerDepartment)}
                      className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d} className="bg-slate-900 text-white">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="officer@police.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                {!isRegistering && (
                  <span className="text-[11px] text-blue-400/80 hover:text-blue-300 cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl font-medium text-sm text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : isRegistering ? (
                  'Complete Registration'
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Toggle between Login and Register */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {isRegistering ? (
              <span>
                Already authorized?{' '}
                <button
                  type="button"
                  onClick={() => {
                    clearError();
                    setIsRegistering(false);
                  }}
                  className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer ml-1"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    clearError();
                    setIsRegistering(true);
                  }}
                  className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer ml-1"
                >
                  Register Here
                </button>
              </span>
            )}
          </div>

          {/* Demo Quick Sign-in Section */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <p className="text-[11px] font-medium text-slate-400 mb-2.5 text-center">
              Quick Test Credentials (1-Click Authorized Access):
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickDemoLogin('off-1')}
                className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/70 border border-slate-700/50 text-left transition-colors cursor-pointer group"
              >
                <div className="text-[11px] font-semibold text-white group-hover:text-blue-400 truncate">
                  Det. Vance
                </div>
                <div className="text-[10px] text-slate-400 font-mono">#PD-4921</div>
              </button>

              <button
                type="button"
                onClick={() => quickDemoLogin('off-2')}
                className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/70 border border-slate-700/50 text-left transition-colors cursor-pointer group"
              >
                <div className="text-[11px] font-semibold text-white group-hover:text-blue-400 truncate">
                  Det. Jenkins
                </div>
                <div className="text-[10px] text-slate-400 font-mono">#PD-1088</div>
              </button>

              <button
                type="button"
                onClick={() => quickDemoLogin('off-3')}
                className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/70 border border-slate-700/50 text-left transition-colors cursor-pointer group"
              >
                <div className="text-[11px] font-semibold text-white group-hover:text-blue-400 truncate">
                  Chief Rostova
                </div>
                <div className="text-[10px] text-slate-400 font-mono">#PD-0341</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer exactly as in the user screenshot */}
        <div className="mt-5 text-center text-xs text-slate-400/90 font-medium tracking-wide flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Authorized Personnel Only</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500">256-Bit Encrypted Portal</span>
        </div>
      </div>
    </div>
  );
};
