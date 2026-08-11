import React, { useState } from 'react';
import Markdown from 'react-markdown';
import {
  Send,
  Dumbbell,
  Flame,
  Code,
  Calendar,
  Sparkles,
  User,
  FileCode,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  Sun,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { RoutineLogMetrics } from '../types';

interface DailyLogSectionProps {
  onLogSubmitted: (newLog: RoutineLogMetrics) => void;
  latestLog: RoutineLogMetrics | null;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

export const DailyLogSection: React.FC<DailyLogSectionProps> = ({
  onLogSubmitted,
  latestLog,
  isLoading,
  setIsLoading,
}) => {
  const [logInput, setLogInput] = useState('');
  const [morningIntentionInput, setMorningIntentionInput] = useState(latestLog?.morning_intention || '');
  const [isSavingIntention, setIsSavingIntention] = useState(false);
  const [intentionSuccess, setIntentionSuccess] = useState<string | null>(null);
  const [logDate, setLogDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; sender: 'user' | 'aegis'; text: string; time: string }>
  >([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showJsonCode, setShowJsonCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick preset templates for logs
  const presets = [
    {
      label: '💪 Push Hypertrophy + Coding',
      text: 'Hit heavy Push Day: Bench press 4x8 (100kg), incline DB press, tricep extension. Ate 3100 calories, 180g protein. Coded 4 hours on React full-stack app.',
    },
    {
      label: '🏋️ Deadlifts & DSA Study',
      text: 'Heavy Pull session: Deadlifts 5x5 (140kg), lat pulldowns, bicep curls. Consumed 2900 kcal, 170g protein. Studied algorithms and Leetcode for 3.5 hours.',
    },
    {
      label: '🧘 Rest Day & Deep Work',
      text: 'Rest day today, did a light 30 min Walk for active recovery. Ate 2400 kcal, 145g protein. Worked 6 hours on backend database schema and API routes.',
    },
    {
      label: '🦵 Leg Day & System Design',
      text: 'Squats 4x8 (120kg), Bulgarian split squats, calf raises. Ate 3300 calories, 190g protein. Reviewed system design and microservices for 3 hours.',
    },
  ];

  // Quick preset starters for morning intentions
  const intentionPresets = [
    '🏋️ Push Day 100kg Bench & 4h React Coding',
    '🎯 180g Protein & 3 DSA Algorithm Problems',
    '🦵 Leg Day 120kg Squats & 3.5h Gemini AI Work',
    '🧘 Recovery Walk & 6h Backend API Refactoring',
  ];

  const handleApplyPreset = (presetText: string) => {
    setLogInput(presetText);
  };

  const handleSaveMorningIntention = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!morningIntentionInput.trim() || isSavingIntention) return;

    setIsSavingIntention(true);
    setErrorMessage(null);
    setIntentionSuccess(null);

    try {
      const res = await fetch('/api/intention', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          morningIntention: morningIntentionInput.trim(),
          customDate: logDate,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to save morning intention.');
      }

      onLogSubmitted(data.metrics);
      setIntentionSuccess(`Morning Intention active for ${logDate}!`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error saving morning intention.');
    } finally {
      setIsSavingIntention(false);
    }
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logInput.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logText: logInput.trim(),
          customDate: logDate,
          morningIntention: morningIntentionInput.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to submit log.');
      }

      onLogSubmitted(data.metrics);
      setLogInput('');
      setIntentionSuccess(null);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred while logging.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    const timeStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg = {
      id: 'msg_' + Date.now(),
      sender: 'user' as const,
      text: userText,
      time: timeStr,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: 'msg_aegis_' + Date.now(),
            sender: 'aegis',
            text: data.reply,
            time: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ]);
      } else {
        throw new Error(data.error || 'No reply received from Aegis.');
      }
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: 'msg_err_' + Date.now(),
          sender: 'aegis',
          text: `⚠️ Error: ${err.message}`,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Logger Box & Quick Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Morning Intentions Input Card */}
          <div className="bg-[#0b0f0d] border border-emerald-500/20 rounded-2xl p-5 shadow-xl space-y-3 carbon-card">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-serif italic text-white">
                  🌅 Morning Focus & Intention Setter
                </h3>
              </div>
              <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider">
                Pre-Day Commitment
              </span>
            </div>

            <p className="text-xs text-white/60 font-light">
              Define your focus priorities for today before logging your evening results. Coach Elite evaluates your execution against this intention.
            </p>

            {/* Intention Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {intentionPresets.map((ip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMorningIntentionInput(ip.replace(/^[^\s]+\s*/, ''))}
                  className="text-[11px] px-2.5 py-1 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-emerald-400 transition-colors font-mono"
                >
                  {ip}
                </button>
              ))}
            </div>

            {/* Input Form for Morning Intention */}
            <form onSubmit={handleSaveMorningIntention} className="space-y-2 pt-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={morningIntentionInput}
                    onChange={(e) => setMorningIntentionInput(e.target.value)}
                    placeholder="e.g. 'Push Day: Bench press 100kg + 180g protein + 4h coding on compiler'"
                    className="w-full bg-white/5 border border-white/20 rounded-md px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-all font-sans"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!morningIntentionInput.trim() || isSavingIntention}
                  className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
                >
                  {isSavingIntention ? (
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Target className="w-3.5 h-3.5" />
                  )}
                  <span>Set Intention</span>
                </button>
              </div>

              {intentionSuccess && (
                <div className="p-2 rounded-sm bg-emerald-950/60 border border-emerald-800/60 text-[11px] text-emerald-300 font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{intentionSuccess}</span>
                </div>
              )}
            </form>

            {/* Display Active Saved Intention if available */}
            {latestLog?.morning_intention && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-md flex items-start gap-2.5">
                <Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                    Active Target Intention for {latestLog.date}:
                  </span>
                  <p className="text-white/90 font-serif italic mt-0.5">"{latestLog.morning_intention}"</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#0b0f0d] border border-emerald-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden carbon-card">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-bold font-serif text-sm">
                  E
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-serif italic text-white">
                    Unstructured Daily Log Input
                  </h2>
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-mono">
                    Hypertrophy • Nutrition • Deep Work
                  </p>
                </div>
              </div>

              {/* Date Selector */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-white/80">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="bg-transparent text-white outline-none text-xs cursor-pointer font-mono"
                />
              </div>
            </div>

            {/* Quick Templates */}
            <div className="mb-4">
              <span className="text-[10px] text-emerald-400 uppercase tracking-[0.2em] font-mono font-bold block mb-2">
                Template Starters:
              </span>
              <div className="flex flex-wrap gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(p.text)}
                    className="text-xs px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-emerald-400 transition-colors flex items-center gap-1 font-mono"
                  >
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={logInput}
                  onChange={(e) => setLogInput(e.target.value)}
                  placeholder='e.g. "Hit heavy pull day, back feels great. Ate 3000 calories, 160g protein. Knocked out 3 hours of frontend development."'
                  rows={5}
                  className="w-full bg-white/5 border border-white/20 rounded-md p-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-all font-sans leading-relaxed resize-none"
                />
                <div className="absolute bottom-3 right-4 text-[10px] font-mono text-white/30 tracking-widest uppercase">
                  {logInput.length} CHARS
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-md bg-red-950/60 border border-red-800/60 text-xs text-red-200 font-mono">
                  {errorMessage}
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <p className="text-[10px] text-white/40 font-mono tracking-wider uppercase">
                  Gemini API auto-extracts JSON schema for DB sync
                </p>

                <button
                  type="submit"
                  disabled={!logInput.trim() || isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-black" />
                      <span>Log & Sync</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Metrics Guide Box */}
          <div className="bg-[#0b0f0d] border border-white/10 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white/40 text-[9px] uppercase font-mono tracking-widest">
                  Workout Focus
                </span>
              </div>
              <span className="text-white font-serif text-xs">Categorized</span>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white/40 text-[9px] uppercase font-mono tracking-widest">
                  Nutrition
                </span>
              </div>
              <span className="text-white font-serif text-xs">Cal & Protein</span>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <Code className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white/40 text-[9px] uppercase font-mono tracking-widest">
                  Deep Work
                </span>
              </div>
              <span className="text-white font-serif text-xs">Study / Coding</span>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white/40 text-[9px] uppercase font-mono tracking-widest">
                  Rating
                </span>
              </div>
              <span className="text-white font-serif text-xs">1 - 10 Score</span>
            </div>
          </div>
        </div>

        {/* Coach Elite Output Panel */}
        <div className="lg:col-span-5 space-y-4">
          {latestLog ? (
            <div className="bg-[#0b0f0d] border border-emerald-500/20 rounded-2xl p-6 shadow-2xl space-y-6 relative carbon-card">
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-emerald-400 uppercase tracking-[0.3em] font-bold font-mono">
                    Coach Response // {latestLog.date}
                  </span>
                </div>

                {/* Habit Score Badge */}
                <div className="px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/40 text-xs font-mono font-light text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>HABIT SCORE: {latestLog.habit_score}/10</span>
                </div>
              </div>

              {/* Extracted Quick Metrics Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/5 border border-white/5 p-3 rounded-lg">
                  <p className="text-[9px] text-white/40 uppercase font-mono tracking-widest mb-1">
                    Workout
                  </p>
                  <p className="text-xs font-serif text-emerald-400 truncate">
                    {latestLog.workout_done
                      ? latestLog.workout_focus || 'Completed'
                      : 'Rest Day'}
                  </p>
                </div>

                <div className="bg-white/5 border border-white/5 p-3 rounded-lg">
                  <p className="text-[9px] text-white/40 uppercase font-mono tracking-widest mb-1">
                    Macros
                  </p>
                  <p className="text-xs font-serif text-emerald-400 truncate">
                    {latestLog.calories_estimated || '?'} kcal / {latestLog.protein_grams || '?'}g P
                  </p>
                </div>

                <div className="bg-white/5 border border-white/5 p-3 rounded-lg">
                  <p className="text-[9px] text-white/40 uppercase font-mono tracking-widest mb-1">
                    Work Hours
                  </p>
                  <p className="text-xs font-serif text-emerald-400 truncate">
                    {latestLog.study_or_coding_hours} hrs
                  </p>
                </div>
              </div>

              {/* PART 1: Markdown Feedback */}
              <div className="bg-white/5 p-6 border-l-2 border-emerald-500 rounded-r-lg text-sm text-white/80 space-y-4 leading-relaxed font-sans">
                <Markdown>{latestLog.coach_feedback}</Markdown>
              </div>

              {/* PART 2: Database JSON Block Preview Toggle */}
              <div className="border-t border-white/10 pt-4">
                <button
                  onClick={() => setShowJsonCode(!showJsonCode)}
                  className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-black hover:bg-white/5 border border-white/10 text-xs font-mono text-white/70 hover:text-emerald-400 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span className="uppercase tracking-widest text-[11px]">
                      Part 2: DB JSON Payload
                    </span>
                  </div>
                  {showJsonCode ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showJsonCode && (
                  <div className="mt-3 p-4 bg-black rounded-lg border border-white/10 text-[11px] font-mono text-emerald-400/90 leading-relaxed overflow-x-auto">
                    <span className="text-white/30 block mb-2">// Extracted Schema for Database Persistence</span>
                    <pre>
                      {JSON.stringify(
                        {
                          date: latestLog.date,
                          workout_done: latestLog.workout_done,
                          workout_focus: latestLog.workout_focus,
                          calories_estimated: latestLog.calories_estimated,
                          protein_grams: latestLog.protein_grams,
                          study_or_coding_hours: latestLog.study_or_coding_hours,
                          habit_score: latestLog.habit_score,
                        },
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#0b0f0d] border border-emerald-500/20 rounded-2xl p-8 text-center space-y-4 carbon-card">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-serif italic text-white">
                  Elite Habit Engine Awaiting Log
                </h3>
                <p className="text-xs text-white/50 max-w-sm mx-auto mt-2 font-light">
                  Submit your daily activities in plain text. Coach Elite will generate feedback and extract structured JSON metrics.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Follow-up Chat Widget */}
      <div className="bg-[#0b0f0d] border border-emerald-500/20 rounded-2xl p-6 shadow-2xl space-y-4 carbon-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-serif italic text-white">
                Consult Coach Elite
              </h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" /> High Thinking Mode (gemini-2.5-flash)
            </span>
          </div>
          <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
            Hypertrophy • Nutrition • Deep Work
          </span>
        </div>

        {/* Chat Messages */}
        <div className="max-h-64 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {chatMessages.length === 0 ? (
            <p className="text-xs text-white/40 text-center py-4 font-light italic">
              Ask Coach Elite for guidance regarding training splits, progressive overload, or deep work focus strategies.
            </p>
          ) : (
            chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'aegis' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-bold font-serif shrink-0">
                    E
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-lg max-w-md ${
                    msg.sender === 'user'
                      ? 'bg-white/10 border border-white/20 text-white'
                      : 'bg-black border border-white/10 text-white/90'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  <span className="text-[9px] text-white/30 block mt-1 text-right font-mono">
                    {msg.time}
                  </span>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white/80 shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))
          )}

          {isChatLoading && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Coach Elite is formulating coaching feedback...</span>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendChat} className="flex items-center gap-3">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask Coach Elite e.g. 'How should I adjust calories on non-training days?'"
            className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-all font-sans"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isChatLoading}
            className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono uppercase tracking-widest flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 fill-black" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

