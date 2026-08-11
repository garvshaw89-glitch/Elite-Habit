import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DailyLogSection } from './components/DailyLogSection';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { LogHistoryTable } from './components/LogHistoryTable';
import { NotificationReminder } from './components/NotificationReminder';
import { LoginScreen } from './components/LoginScreen';
import { ProfileSection } from './components/ProfileSection';
import { RoutineLogMetrics, UserTargets, UserSession } from './types';
import { Shield } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'log' | 'analytics' | 'history' | 'profile'>('log');
  const [logs, setLogs] = useState<RoutineLogMetrics[]>([]);

  const [latestLog, setLatestLog] = useState<RoutineLogMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('elite_habit_user_session') || localStorage.getItem('aegis_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [targets, setTargets] = useState<UserTargets>({
    dailyCaloriesTarget: 3000,
    dailyProteinTarget: 175,
    dailyStudyHoursTarget: 4,
    weeklyWorkoutsTarget: 5,
  });

  // Fetch initial logs from backend API
  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        setLogs(data.logs);
        if (data.logs.length > 0) {
          setLatestLog(data.logs[0]);
        }
      }
    } catch (err) {
      console.error('Error loading logs:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('elite_habit_user_session');
    localStorage.removeItem('aegis_user_session');
    setUserSession(null);
  };

  if (!userSession || !userSession.isLoggedIn) {
    return <LoginScreen onLoginSuccess={(session) => setUserSession(session)} />;
  }

  const handleLogSubmitted = (newLog: RoutineLogMetrics) => {
    setLatestLog(newLog);
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch('/api/logs/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        setLogs(data.logs);
        if (data.logs.length > 0) {
          setLatestLog(data.logs[0]);
        }
      }
    } catch (err) {
      console.error('Error seeding demo logs:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all log entries?')) return;
    try {
      const res = await fetch('/api/logs/clear', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setLogs([]);
        setLatestLog(null);
      }
    } catch (err) {
      console.error('Error clearing logs:', err);
    }
  };

  const handleDeleteLog = async (id: string) => {
    try {
      const res = await fetch(`/api/logs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        setLogs(data.logs);
        if (latestLog?.id === id) {
          setLatestLog(data.logs[0] || null);
        }
      }
    } catch (err) {
      console.error('Error deleting log:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#070908] text-white font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSeedData={handleSeedData}
        isSeeding={isSeeding}
        totalLogsCount={logs.length}
        userSession={userSession}
        onLogout={handleLogout}
      />


      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 sm:pb-8">
        {/* Banner Hero */}
        <div className="mb-6 sm:mb-8 p-5 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0d1310] via-[#0a0f0d] to-[#070a08] border border-emerald-500/20 shadow-2xl relative overflow-hidden carbon-card">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                  <Shield className="w-3 h-3" /> Elite Habit System Active
                </span>
                <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase hidden sm:inline">
                  // Powered by Gemini AI
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-bold font-serif tracking-tight text-white italic">
                Personal High Performance Routine & Habit Architecture
              </h2>
              <p className="text-xs sm:text-sm text-white/70 max-w-2xl font-light leading-relaxed">
                Hypertrophy & strength analytics, macro intake optimization, and deep productivity habit logging backed by real-time AI insights.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center justify-around sm:justify-start gap-4 sm:gap-6 bg-black/60 p-3.5 sm:p-4 rounded-xl border border-emerald-500/20 shrink-0 text-xs shadow-lg">
              <div>
                <span className="text-white/40 text-[9px] uppercase font-mono tracking-widest block mb-1">
                  Logged Days
                </span>
                <span className="font-extrabold text-emerald-400 text-xl sm:text-2xl font-mono">{logs.length}</span>
              </div>
              <div className="w-[1px] h-8 sm:h-10 bg-white/10" />
              <div>
                <span className="text-white/40 text-[9px] uppercase font-mono tracking-widest block mb-1">
                  Avg Habit Score
                </span>
                <span className="font-extrabold text-emerald-400 text-xl sm:text-2xl font-mono">
                  {logs.length > 0
                    ? (logs.reduce((acc, c) => acc + c.habit_score, 0) / logs.length).toFixed(1)
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Routine Reminder System Simulation */}
        <NotificationReminder
          logs={logs}
          onNavigateToLog={() => setActiveTab('log')}
        />

        {/* Tab Views */}
        {activeTab === 'log' && (
          <DailyLogSection
            onLogSubmitted={handleLogSubmitted}
            latestLog={latestLog}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            logs={logs}
            targets={targets}
            setTargets={setTargets}
          />
        )}

        {activeTab === 'history' && (
          <LogHistoryTable
            logs={logs}
            onDeleteLog={handleDeleteLog}
            onClearAll={handleClearAll}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSection
            userSession={userSession}
            targets={targets}
            onUpdateTargets={(newTargets) => setTargets(newTargets)}
            onUpdateSession={(newSession) => setUserSession(newSession)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0a] py-6 mt-16 text-center text-[10px] text-white/40 font-mono uppercase tracking-[0.2em]">
        <p>Elite Habit System • Precision Performance Architecture • Gemini 2.5 Flash</p>
      </footer>
    </div>
  );
}

