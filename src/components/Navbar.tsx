import React from 'react';
import { Shield, BarChart3, Database, Sparkles, RefreshCw, LogOut, User, Crown } from 'lucide-react';
import { UserSession } from '../types';

interface NavbarProps {
  activeTab: 'log' | 'analytics' | 'history' | 'profile';
  setActiveTab: (tab: 'log' | 'analytics' | 'history' | 'profile') => void;
  onSeedData: () => void;
  isSeeding: boolean;
  totalLogsCount: number;
  userSession?: UserSession | null;
  onLogout?: () => void;
}


export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSeedData,
  isSeeding,
  totalLogsCount,
  userSession,
  onLogout,
}) => {
  return (
    <>
      <header className="sticky top-0 z-40 bg-[#070908]/90 backdrop-blur-md border-b border-emerald-500/20 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 py-2">
            {/* Brand */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center rounded-lg shadow-lg shadow-emerald-950/50 border border-emerald-300/30 shrink-0">
                <span className="text-black font-extrabold text-base sm:text-xl font-serif">EH</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-base sm:text-xl font-bold tracking-wider uppercase font-serif text-white">
                    Elite Habit
                  </h1>
                  <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] uppercase px-1.5 sm:px-2 py-0.5 rounded-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                    PRO
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-emerald-400/60 tracking-[0.15em] sm:tracking-[0.2em] uppercase font-mono hidden sm:block">
                  High Performance Routine Architecture
                </p>
              </div>
            </div>

            {/* Desktop & Tablet Navigation Tabs (hidden on mobile, visible on sm and up) */}
            <nav className="hidden sm:flex items-center gap-1.5 md:gap-2">
              <button
                onClick={() => setActiveTab('log')}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition-all ${
                  activeTab === 'log'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/50 shadow-sm shadow-emerald-950/50'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Daily Log</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/50 shadow-sm shadow-emerald-950/50'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition-all ${
                  activeTab === 'history'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/50 shadow-sm shadow-emerald-950/50'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Database</span>
                {totalLogsCount > 0 && (
                  <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {totalLogsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition-all ${
                  activeTab === 'profile'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/50 shadow-sm shadow-emerald-950/50'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Profile & Plans</span>
                <Crown className="w-3 h-3 text-emerald-400 hidden lg:inline" />
              </button>
            </nav>

            {/* Actions & User Status */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onSeedData}
                disabled={isSeeding}
                title="Load demo sample logs"
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-md bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-emerald-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSeeding ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">Demo Data</span>
              </button>

              {userSession && (
                <div className="flex items-center gap-2 border-l border-white/10 pl-2 sm:pl-3">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-white/40">
                      Authenticated
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {userSession.phoneNumber}
                    </span>
                  </div>
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      title="Sign out of Elite Habit"
                      className="p-1.5 sm:p-2 rounded-md bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (visible on mobile screens < sm) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#070908]/95 backdrop-blur-lg border-t border-emerald-500/20 px-2 py-1.5">
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('log')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
              activeTab === 'log'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-mono tracking-tight uppercase">Log</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
              activeTab === 'analytics'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-mono tracking-tight uppercase">Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all relative ${
              activeTab === 'history'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-mono tracking-tight uppercase">Data</span>
            {totalLogsCount > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <User className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-mono tracking-tight uppercase">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};


