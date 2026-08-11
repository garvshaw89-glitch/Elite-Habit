import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Sparkles, CheckCircle2, X, Settings, Send, ShieldAlert } from 'lucide-react';
import { RoutineLogMetrics } from '../types';

interface NotificationReminderProps {
  logs: RoutineLogMetrics[];
  onNavigateToLog: () => void;
}

export const NotificationReminder: React.FC<NotificationReminderProps> = ({
  logs,
  onNavigateToLog,
}) => {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>('20:00'); // 8:00 PM default
  const [customPrompt, setCustomPrompt] = useState<string>(
    "⚡ Coach Elite Reminder: Lock in today's workout, macros, and deep work hours to protect your habit streak!"
  );
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [simulatedActiveToast, setSimulatedActiveToast] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogged = logs.some((log) => log.date === todayStr);

  // Auto-check evening time simulation or initial state
  useEffect(() => {
    // If today is already logged or dismissed, clear active toast simulation
    if (todayLogged) {
      setSimulatedActiveToast(false);
    }
  }, [todayLogged]);

  const handleSimulateNow = () => {
    setIsDismissed(false);
    setSimulatedActiveToast(true);
  };

  const isReminderActive = enabled && !todayLogged && !isDismissed;

  return (
    <div className="mb-6 space-y-4">
      {/* Configuration & Simulation Control Bar */}
      <div className="bg-[#0b0f0d] border border-emerald-500/20 rounded-xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 carbon-card">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg border ${
            todayLogged
              ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400'
              : enabled
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-white/5 border-white/10 text-white/40'
          }`}>
            {todayLogged ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : enabled ? (
              <Bell className="w-5 h-5 animate-pulse" />
            ) : (
              <BellOff className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                Daily Routine Reminder Simulation
              </span>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-sm uppercase tracking-widest font-semibold ${
                todayLogged
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                  : enabled
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-white/5 text-white/40 border border-white/10'
              }`}>
                {todayLogged ? 'Today Logged ✓' : enabled ? `Scheduled @ ${reminderTime}` : 'Disabled'}
              </span>
            </div>
            <p className="text-xs text-white/50 font-light mt-0.5">
              {todayLogged
                ? "Great job! Today's routine log is locked in. Reminder will reset tomorrow evening."
                : `Simulates an automated evening 'Prompt to Log' reminder if today's entry is missing at ${reminderTime}.`}
            </p>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={handleSimulateNow}
            className="px-3 py-1.5 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
            title="Simulate prompt reminder right now"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Test Reminder</span>
          </button>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-white/60" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Settings Modal / Drawer */}
      {showConfig && (
        <div className="bg-[#121212] border border-emerald-500/20 rounded-xl p-5 shadow-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Configure Daily Notification Schedule
            </h4>
            <button
              onClick={() => setShowConfig(false)}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Toggle Switch */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 block">
                Notification State
              </label>
              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                className={`w-full py-2 px-3 rounded-md border font-mono text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                  enabled
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}
              >
                {enabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                <span>{enabled ? 'System Active' : 'System Paused'}</span>
              </button>
            </div>

            {/* Scheduled Time */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 block">
                Evening Prompt Time
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-md px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 block">
                Quick Evening Schedules
              </label>
              <div className="flex gap-1.5">
                {['19:00', '20:00', '21:00', '22:00'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setReminderTime(t)}
                    className={`flex-1 py-1.5 rounded-sm border font-mono text-[11px] transition-colors ${
                      reminderTime === t
                        ? 'bg-emerald-500 text-black font-bold border-emerald-500'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Prompt Text */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 block">
              Custom Prompt Message Text
            </label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter custom reminder prompt..."
              className="w-full bg-black border border-white/20 rounded-md px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      )}

      {/* Prominent Reminder Prompt Banner / Toast (Active when triggered or when unlogged) */}
      {(simulatedActiveToast || (isReminderActive && !isDismissed)) && (
        <div className="bg-gradient-to-r from-[#0d1410] via-[#0b120e] to-[#070a08] border-2 border-emerald-500/60 rounded-xl p-5 shadow-2xl relative overflow-hidden animate-in slide-in-from-top-2 duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-emerald-500 text-black rounded-lg shadow-lg shrink-0 mt-0.5">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    Coach Elite • Scheduled Prompt ({reminderTime})
                  </span>
                  <span className="text-[10px] font-mono text-white/40 uppercase">
                    Unlogged Entry Detected
                  </span>
                </div>
                <h3 className="text-base font-serif italic text-white">
                  Routine Entry Pending for {todayStr}
                </h3>
                <p className="text-xs text-white/80 font-sans leading-relaxed max-w-2xl">
                  {customPrompt}
                </p>
              </div>
            </div>

            {/* Banner Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              <button
                onClick={() => {
                  setSimulatedActiveToast(false);
                  onNavigateToLog();
                }}
                className="px-4 py-2.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Log Routine Now</span>
              </button>

              <button
                onClick={() => {
                  setSimulatedActiveToast(false);
                  setIsDismissed(true);
                }}
                className="px-3 py-2.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 text-xs font-mono uppercase tracking-wider transition-colors"
                title="Dismiss reminder for today"
              >
                <span>Dismiss</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
