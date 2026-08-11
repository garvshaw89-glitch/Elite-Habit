import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts';
import {
  Award,
  Dumbbell,
  Flame,
  Code,
  TrendingUp,
  Zap,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Target,
  Info,
  CheckCircle2,
  Sun,
  Calendar,
} from 'lucide-react';
import { RoutineLogMetrics, UserTargets } from '../types';

interface InfoTooltipProps {
  title?: string;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'right' | 'left';
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ title, content, position = 'top' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        className="text-white/40 hover:text-[#10b981] focus:text-[#10b981] focus:outline-none transition-colors p-0.5 rounded-full cursor-help"
        aria-label="Habit score info"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 w-72 p-3.5 bg-[#121212] border border-[#10b981]/40 rounded-md shadow-2xl text-xs text-white font-sans pointer-events-none transition-all duration-150 ${
            position === 'bottom'
              ? 'top-full left-1/2 -translate-x-1/2 mt-2'
              : position === 'right'
              ? 'left-full top-1/2 -translate-y-1/2 ml-2'
              : position === 'left'
              ? 'right-full top-1/2 -translate-y-1/2 mr-2'
              : 'bottom-full left-1/2 -translate-x-1/2 mb-2'
          }`}
        >
          {title && (
            <div className="font-mono text-[10px] uppercase font-bold text-[#10b981] tracking-wider mb-1.5 pb-1 border-b border-white/10 flex items-center justify-between">
              <span>{title}</span>
            </div>
          )}
          <div className="text-[11px] leading-relaxed text-white/80 space-y-1 font-sans font-light">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

interface CircularProgressCardProps {
  title: string;
  current: number;
  target: number;
  unit: string;
  icon: React.ReactNode;
  strokeColor?: string;
  subtext?: string;
  tooltipTitle?: string;
  tooltipContent?: React.ReactNode;
}

const CircularProgressCard: React.FC<CircularProgressCardProps> = ({
  title,
  current,
  target,
  unit,
  icon,
  strokeColor = '#10b981',
  subtext,
  tooltipTitle,
  tooltipContent,
}) => {
  const percentage = target > 0 ? Math.round((current / target) * 100) : 0;
  const cappedPercentage = Math.min(100, Math.max(0, percentage));
  const radius = 38;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (cappedPercentage / 100) * circumference;

  return (
    <div className="bg-black/60 border border-white/10 p-5 rounded-md flex flex-col items-center justify-between text-center relative overflow-hidden group hover:border-[#10b981]/40 transition-all">
      <div className="flex items-center justify-between w-full mb-2 pb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest flex items-center gap-1.5">
            {icon}
            {title}
          </span>
          {tooltipContent && (
            <InfoTooltip title={tooltipTitle || title} content={tooltipContent} />
          )}
        </div>
        <span className="text-xs font-mono font-bold text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20 px-2 py-0.5 rounded-sm">
          {percentage}%
        </span>
      </div>

      <div className="relative w-32 h-32 my-2 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-white/10"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-light font-mono text-white leading-none">
            {current}
          </span>
          <span className="text-[10px] font-mono text-white/40 mt-1">
            Target: {target} {unit}
          </span>
        </div>
      </div>

      <div className="text-[10px] font-mono text-white/50 tracking-wider uppercase mt-1">
        {subtext || `${current} / ${target} ${unit} logged`}
      </div>
    </div>
  );
};

interface AnalyticsDashboardProps {
  logs: RoutineLogMetrics[];
  targets: UserTargets;
  setTargets: React.Dispatch<React.SetStateAction<UserTargets>>;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  logs,
  targets,
}) => {
  // Compute analytics
  const totalLogs = logs.length;
  if (totalLogs === 0) {
    return (
      <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-sm bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-[#10b981] mx-auto">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-serif italic text-white">No Routine Logs Recorded Yet</h3>
        <p className="text-xs text-white/50 max-w-sm mx-auto font-light">
          Submit your daily log in the 'Daily Log' tab or click 'Demo Data' in the top header to populate analytics instantly.
        </p>
      </div>
    );
  }

  // Chronologically sorted logs and 7-day moving average computation
  const sortedLogs = [...logs].sort((a, b) => a.date.localeCompare(b.date));

  const chartData = sortedLogs.map((log, index, array) => {
    // 7-day rolling window
    const windowStart = Math.max(0, index - 6);
    const windowLogs = array.slice(windowStart, index + 1);
    const windowSum = windowLogs.reduce((acc, curr) => acc + curr.habit_score, 0);
    const movingAverage = Number((windowSum / windowLogs.length).toFixed(2));

    return {
      date: log.date.substring(5), // MM-DD
      fullDate: log.date,
      habitScore: log.habit_score,
      movingAverage,
      windowSize: windowLogs.length,
      calories: log.calories_estimated || 0,
      protein: log.protein_grams || 0,
      studyHours: log.study_or_coding_hours,
      workoutFocus: log.workout_focus || 'Rest',
      workoutDone: log.workout_done,
    };
  });

  const latestMA = chartData.length > 0 ? chartData[chartData.length - 1].movingAverage : 0;
  const previousMA = chartData.length >= 2 ? chartData[chartData.length - 2].movingAverage : latestMA;
  const maDiff = Number((latestMA - previousMA).toFixed(2));
  const peakMA = chartData.length > 0 ? Math.max(...chartData.map((d) => d.movingAverage)) : 0;
  const minMA = chartData.length > 0 ? Math.min(...chartData.map((d) => d.movingAverage)) : 0;

  const avgHabitScore = (
    logs.reduce((acc, curr) => acc + curr.habit_score, 0) / totalLogs
  ).toFixed(1);

  const workoutsDoneCount = logs.filter((l) => l.workout_done).length;
  const workoutRate = Math.round((workoutsDoneCount / totalLogs) * 100);

  const validCalories = logs.filter((l) => l.calories_estimated != null);
  const avgCalories = validCalories.length
    ? Math.round(
        validCalories.reduce((acc, curr) => acc + (curr.calories_estimated || 0), 0) /
          validCalories.length
      )
    : 0;

  const validProtein = logs.filter((l) => l.protein_grams != null);
  const avgProtein = validProtein.length
    ? Math.round(
        validProtein.reduce((acc, curr) => acc + (curr.protein_grams || 0), 0) /
          validProtein.length
      )
    : 0;

  const totalStudyHours = logs.reduce(
    (acc, curr) => acc + curr.study_or_coding_hours,
    0
  );
  const avgStudyHours = (totalStudyHours / totalLogs).toFixed(1);

  // Latest daily log data for progress rings
  const latestLog = sortedLogs.length > 0 ? sortedLogs[sortedLogs.length - 1] : null;
  const latestDate = latestLog ? latestLog.date : 'N/A';
  const latestCalories = latestLog?.calories_estimated ?? 0;
  const latestProtein = latestLog?.protein_grams ?? 0;
  const latestStudyHours = latestLog?.study_or_coding_hours ?? 0;

  // Streak Calculation State & Computation
  const [streakThreshold, setStreakThreshold] = useState<number>(7.0);

  const getDayDiff = (dateStr1: string, dateStr2: string) => {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  // Current Streak Calculation
  let currentStreak = 0;
  const activeStreakLogs: RoutineLogMetrics[] = [];

  if (sortedLogs.length > 0) {
    for (let i = sortedLogs.length - 1; i >= 0; i--) {
      const log = sortedLogs[i];
      if (log.habit_score >= streakThreshold) {
        if (i === sortedLogs.length - 1) {
          currentStreak++;
          activeStreakLogs.push(log);
        } else {
          const nextLog = sortedLogs[i + 1];
          const dayDiff = getDayDiff(log.date, nextLog.date);
          if (dayDiff <= 1) {
            currentStreak++;
            activeStreakLogs.push(log);
          } else {
            break;
          }
        }
      } else {
        break;
      }
    }
  }

  // Longest Streak Calculation
  let longestStreak = 0;
  let currentTemp = 0;

  for (let i = 0; i < sortedLogs.length; i++) {
    const log = sortedLogs[i];
    if (log.habit_score >= streakThreshold) {
      if (i === 0) {
        currentTemp = 1;
      } else {
        const prevLog = sortedLogs[i - 1];
        const dayDiff = getDayDiff(prevLog.date, log.date);
        if (dayDiff <= 1) {
          currentTemp++;
        } else {
          currentTemp = 1;
        }
      }
      if (currentTemp > longestStreak) {
        longestStreak = currentTemp;
      }
    } else {
      currentTemp = 0;
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Habit Score Card */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
                Avg Habit Score
              </span>
              <InfoTooltip
                title="Habit Score Breakdown (1-10)"
                content={
                  <ul className="space-y-1 text-[11px]">
                    <li>• <strong className="text-[#10b981]">Workout (30%)</strong>: Gym session completion or active recovery walk.</li>
                    <li>• <strong className="text-[#10b981]">Nutrition (30%)</strong>: Hitting daily protein (160g+) and calorie targets.</li>
                    <li>• <strong className="text-[#10b981]">Deep Work (30%)</strong>: Hours logged in high-focus study or coding.</li>
                    <li>• <strong className="text-[#10b981]">Discipline (10%)</strong>: Overall routine consistency & recovery.</li>
                  </ul>
                }
              />
            </div>
            <div className="p-2 rounded-sm bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-light font-mono text-[#10b981]">{avgHabitScore}</span>
            <span className="text-xs text-white/30 font-mono">/ 10.0</span>
          </div>
          <p className="text-[10px] text-white/50 font-mono tracking-wider uppercase mt-1">
            Across {totalLogs} logged days
          </p>
        </div>

        {/* Current Habit Streak Card */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
                Active Habit Streak
              </span>
              <InfoTooltip
                title="Current Habit Streak"
                content={
                  <span>
                    Number of consecutive daily logs with a Habit Score of <strong className="text-[#10b981]">&ge; {streakThreshold.toFixed(1)}</strong>. Missing days or lower scores break the streak.
                  </span>
                }
              />
            </div>
            <div className="p-2 rounded-sm bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981]">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-light font-mono text-[#10b981]">{currentStreak}</span>
            <span className="text-xs text-white/40 font-mono">
              {currentStreak === 1 ? 'day' : 'days'}
            </span>
          </div>
          <p className="text-[10px] text-white/50 font-mono tracking-wider uppercase mt-1">
            Best Streak: {longestStreak} days (&ge;{streakThreshold.toFixed(1)})
          </p>
        </div>

        {/* Workout Consistency Card */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
                Workout Consistency
              </span>
              <InfoTooltip
                title="Workout Score Weight (30%)"
                content="Completing planned workouts or intentional active recovery walks contributes up to 3.0 points toward your daily Habit Score."
              />
            </div>
            <div className="p-2 rounded-sm bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981]">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-light font-mono text-[#10b981]">{workoutRate}%</span>
            <span className="text-xs text-white/30 font-mono">
              ({workoutsDoneCount}/{totalLogs} days)
            </span>
          </div>
          <p className="text-[10px] text-white/50 font-mono tracking-wider uppercase mt-1">
            Target: 4-5 sessions / week
          </p>
        </div>

        {/* Macros Averages Card */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
                Avg Daily Nutrition
              </span>
              <InfoTooltip
                title="Nutrition Score Weight (30%)"
                content="Meeting target protein (supports hypertrophy) and keeping calories within range contributes up to 3.0 points toward your daily Habit Score."
              />
            </div>
            <div className="p-2 rounded-sm bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981]">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-light font-mono text-white">
              {avgCalories} <span className="text-xs text-white/30">kcal</span>
            </span>
            <span className="text-xs font-mono text-[#10b981]">
              {avgProtein}g P
            </span>
          </div>
          <p className="text-[10px] text-white/40 font-mono tracking-wider uppercase mt-1">
            Target: {targets.dailyCaloriesTarget} kcal / {targets.dailyProteinTarget}g protein
          </p>
        </div>

        {/* Productivity Hours Card */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
                Deep Work Hours
              </span>
              <InfoTooltip
                title="Productivity Score Weight (30%)"
                content="Logging focused coding or academic study hours adds up to 3.0 points toward your daily Habit Score, reinforcing cognitive discipline."
              />
            </div>
            <div className="p-2 rounded-sm bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981]">
              <Code className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-light font-mono text-[#10b981]">
              {totalStudyHours.toFixed(1)} <span className="text-xs text-white/30">hrs</span>
            </span>
            <span className="text-xs text-white/40 font-mono">
              (~{avgStudyHours}h / day)
            </span>
          </div>
          <p className="text-[10px] text-white/40 font-mono tracking-wider uppercase mt-1">
            Target: {targets.dailyStudyHoursTarget}h / day deep work
          </p>
        </div>
      </div>

      {/* Daily Target Progress Rings Module */}
      <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-[#10b981] uppercase tracking-[0.2em] font-mono font-bold">
                Daily Performance Target Rings
              </span>
            </div>
            <h3 className="text-xl font-serif italic text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-[#10b981]" />
              <span>Latest Log Daily Target Progress ({latestDate})</span>
              <InfoTooltip
                title="Target Rings & Habit Score Impact"
                content="These progress rings display how close your latest logged metrics came to your target goals. Progress across protein, calories, and deep work directly determines your AI-evaluated Habit Score."
              />
            </h3>
            <p className="text-xs text-white/50 font-light mt-0.5">
              Visual circular progress rings comparing latest daily log metrics against target benchmarks.
            </p>
          </div>

          {latestLog && (
            <div className="flex items-center gap-2 text-xs font-mono text-[#10b981] bg-white/5 px-3 py-1.5 rounded-sm border border-[#10b981]/30 self-start sm:self-auto">
              <Flame className="w-3.5 h-3.5 text-[#10b981]" />
              <span>Active Log: {latestLog.date}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CircularProgressCard
            title="Daily Protein Target"
            current={latestProtein}
            target={targets.dailyProteinTarget}
            unit="g"
            icon={<Flame className="w-3.5 h-3.5 text-[#10b981]" />}
            strokeColor="#10b981"
            subtext={
              latestProtein >= targets.dailyProteinTarget
                ? "Protein Target Goal Achieved ✓"
                : `${targets.dailyProteinTarget - latestProtein}g needed to reach target`
            }
            tooltipTitle="Protein Intake & Habit Score"
            tooltipContent={`Protein compliance (~30% of Habit Score) supports muscle synthesis and physical recovery. Target is ${targets.dailyProteinTarget}g.`}
          />

          <CircularProgressCard
            title="Daily Calorie Target"
            current={latestCalories}
            target={targets.dailyCaloriesTarget}
            unit="kcal"
            icon={<Flame className="w-3.5 h-3.5 text-[#34d399]" />}
            strokeColor="#34d399"
            subtext={
              latestCalories >= targets.dailyCaloriesTarget
                ? "Calorie Intake Target Reached"
                : `${targets.dailyCaloriesTarget - latestCalories} kcal under target limit`
            }
            tooltipTitle="Caloric Intake & Energy"
            tooltipContent={`Meeting your calorie goal (~20% of Habit Score) ensures adequate fuel for heavy training and cognitive endurance. Target is ${targets.dailyCaloriesTarget} kcal.`}
          />

          <CircularProgressCard
            title="Daily Deep Work Target"
            current={latestStudyHours}
            target={targets.dailyStudyHoursTarget}
            unit="hrs"
            icon={<Code className="w-3.5 h-3.5 text-white" />}
            strokeColor="#e0e0e0"
            subtext={
              latestStudyHours >= targets.dailyStudyHoursTarget
                ? "Deep Work Goal Completed ✓"
                : `${(targets.dailyStudyHoursTarget - latestStudyHours).toFixed(1)} hrs remaining to target`
            }
            tooltipTitle="Deep Work & Cognitive Output"
            tooltipContent={`Deep work hours (~30% of Habit Score) reflect focused development and academic discipline. Target is ${targets.dailyStudyHoursTarget} hrs.`}
          />
        </div>
      </div>

      {/* Morning Intentions vs Daily Execution Matrix Module */}
      <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-[#10b981] uppercase tracking-[0.2em] font-mono font-bold">
                Intentional Execution
              </span>
            </div>
            <h3 className="text-xl font-serif italic text-white flex items-center gap-2">
              <Sun className="w-5 h-5 text-[#10b981]" />
              <span>Morning Focus Intentions & Execution Log</span>
              <InfoTooltip
                title="Intentional Execution Tracking"
                content="Compares your morning focus commitments against actual evening performance results. Pre-setting focus targets improves habit adherence by up to 2.4x."
              />
            </h3>
            <p className="text-xs text-white/50 font-light mt-0.5">
              Review your stated morning targets alongside actual evening log results and habit score outcomes.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-black px-3 py-1.5 rounded-sm border border-white/10 text-xs font-mono">
            <Target className="w-3.5 h-3.5 text-[#10b981]" />
            <span className="text-white/70">
              {logs.filter(l => l.morning_intention).length} / {totalLogs} Days with Intentions
            </span>
          </div>
        </div>

        {/* Intentions Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-black/50 border border-white/10 p-4 rounded-md space-y-3 hover:border-[#10b981]/40 transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <Calendar className="w-3.5 h-3.5 text-[#10b981]" />
                  <span className="font-bold text-white">{log.date}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-white/40 text-[10px] uppercase">Score:</span>
                  <span className={`px-2 py-0.5 rounded-sm font-bold text-[10px] ${
                    log.habit_score >= 8
                      ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
                      : log.habit_score >= 6
                      ? 'bg-[#10b981]/20 text-[#10b981]'
                      : 'bg-red-950/80 text-red-400'
                  }`}>
                    {log.habit_score}/10
                  </span>
                </div>
              </div>

              {/* Morning Intention Row */}
              <div className="bg-[#10b981]/10 border border-[#10b981]/20 p-3 rounded-sm space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#10b981] uppercase font-bold">
                  <Sun className="w-3 h-3" />
                  <span>Morning Focus Intention Target:</span>
                </div>
                <p className="text-xs text-white/90 font-serif italic">
                  {log.morning_intention ? `"${log.morning_intention}"` : 'No explicit morning focus set for this date.'}
                </p>
              </div>

              {/* Logged Outcome Row */}
              <div className="bg-white/5 border border-white/5 p-3 rounded-sm space-y-1 text-xs font-sans">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40 uppercase">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Evening Execution Log Result:</span>
                </div>
                <p className="text-white/80 text-[11px] leading-relaxed italic line-clamp-2">
                  "{log.raw_text}"
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[9px] uppercase">
                  {log.workout_done && (
                    <span className="bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 px-1.5 py-0.5 rounded-sm">
                      {log.workout_focus || 'Workout Done'}
                    </span>
                  )}
                  {log.protein_grams && (
                    <span className="bg-white/5 border border-white/10 text-white/70 px-1.5 py-0.5 rounded-sm">
                      {log.protein_grams}g Protein
                    </span>
                  )}
                  <span className="bg-white/5 border border-white/10 text-white/70 px-1.5 py-0.5 rounded-sm">
                    {log.study_or_coding_hours}h Study
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Habit Streak & Discipline Pipeline Module */}
      <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-[#10b981] uppercase tracking-[0.2em] font-mono font-bold">
                Consistency Engine
              </span>
            </div>
            <h3 className="text-xl font-serif italic text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#10b981]" />
              <span>Current Habit Streak & Discipline Pipeline</span>
              <InfoTooltip
                title="Streak Threshold Rules"
                content="A streak measures uninterrupted, consecutive days where your habit score meets or exceeds the chosen threshold. Rest days or incomplete routines that drop below threshold reset the current active streak."
              />
            </h3>
            <p className="text-xs text-white/50 font-light mt-0.5">
              Tracks continuous daily execution based on habit score thresholds. Adjust the threshold below to test streak rigor.
            </p>
          </div>

          {/* Threshold Switcher */}
          <div className="flex items-center gap-1.5 bg-black p-1.5 rounded-sm border border-white/10 text-xs font-mono self-start sm:self-auto">
            <span className="text-[10px] text-white/40 px-2 uppercase tracking-wider hidden sm:inline">
              Score Limit:
            </span>
            {[6.0, 7.0, 8.0, 9.0].map((th) => (
              <button
                key={th}
                onClick={() => setStreakThreshold(th)}
                className={`px-2.5 py-1 rounded-sm uppercase tracking-wider transition-all ${
                  streakThreshold === th
                    ? 'bg-[#10b981] text-black font-bold shadow-md'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                &ge; {th.toFixed(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Streak Metrics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-black/60 border border-white/10 p-4 rounded-md flex items-center justify-between">
            <div>
              <p className="text-[9px] text-white/40 uppercase font-mono tracking-widest mb-1">
                Active Current Streak
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-light font-mono text-[#10b981]">{currentStreak}</span>
                <span className="text-xs text-white/40 font-mono">consecutive days</span>
              </div>
              <p className="text-[10px] text-emerald-400/90 font-mono tracking-wider uppercase mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{currentStreak > 0 ? 'Streak currently active' : 'Streak reset — log today to reignite'}</span>
              </p>
            </div>
            <div className="p-3 bg-[#10b981]/10 border border-[#10b981]/30 rounded-full text-[#10b981]">
              <Zap className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-black/60 border border-white/10 p-4 rounded-md flex items-center justify-between">
            <div>
              <p className="text-[9px] text-white/40 uppercase font-mono tracking-widest mb-1">
                All-Time Longest Streak
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-light font-mono text-white">{longestStreak}</span>
                <span className="text-xs text-white/40 font-mono">max consecutive days</span>
              </div>
              <p className="text-[10px] text-white/40 font-mono tracking-wider uppercase mt-1">
                Record at &ge;{streakThreshold.toFixed(1)} score limit
              </p>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-full text-white/60">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-black/60 border border-white/10 p-4 rounded-md flex items-center justify-between">
            <div>
              <p className="text-[9px] text-white/40 uppercase font-mono tracking-widest mb-1">
                Threshold Compliance Rate
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-light font-mono text-white">
                  {Math.round((logs.filter((l) => l.habit_score >= streakThreshold).length / totalLogs) * 100)}%
                </span>
                <span className="text-xs text-white/40 font-mono">
                  ({logs.filter((l) => l.habit_score >= streakThreshold).length}/{totalLogs} days)
                </span>
              </div>
              <p className="text-[10px] text-white/40 font-mono tracking-wider uppercase mt-1">
                Days meeting &ge;{streakThreshold.toFixed(1)} score
              </p>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-full text-white/60">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Active Streak Log Timeline */}
        {activeStreakLogs.length > 0 ? (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white/60 flex items-center justify-between">
              <span>Active Streak Log Sequence ({activeStreakLogs.length} Days)</span>
              <span className="text-[#10b981] font-bold">Habit Threshold: &ge;{streakThreshold.toFixed(1)}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
              {activeStreakLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-black/40 border border-[#10b981]/30 p-3 rounded-md space-y-2 hover:border-[#10b981] transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span className="font-bold text-[#10b981]">{log.date}</span>
                    <span className="bg-[#10b981]/20 text-[#10b981] px-2 py-0.5 rounded-sm font-bold text-[10px]">
                      {log.habit_score}/10
                    </span>
                  </div>
                  <div className="text-[11px] text-white/80 space-y-1 font-sans">
                    <p className="truncate text-white/70 italic">"{log.raw_text}"</p>
                    <div className="flex flex-wrap gap-1 pt-1 font-mono text-[9px] uppercase">
                      {log.workout_done && (
                        <span className="bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 px-1.5 py-0.5 rounded-sm">
                          Workout
                        </span>
                      )}
                      <span className="bg-white/5 border border-white/10 text-white/70 px-1.5 py-0.5 rounded-sm">
                        {log.study_or_coding_hours}h work
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-white/5 border border-white/10 rounded-md text-center text-xs font-mono text-white/50">
            No active streak at &ge;{streakThreshold.toFixed(1)} threshold. Log a high-performing day to start a new streak!
          </div>
        )}
      </div>

      {/* Trend Analysis Module: 7-Day Moving Average */}
      <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-[#10b981] uppercase tracking-[0.2em] font-mono font-bold">
                Analytics Module
              </span>
            </div>
            <h3 className="text-xl font-serif italic text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#10b981]" />
              <span>Trend Analysis — 7-Day Moving Average</span>
              <InfoTooltip
                title="7-Day Moving Average Calculation"
                content="Calculates a rolling 7-day average of your daily Habit Scores (1-10). Smooths out single-day rest or busy days to highlight your true long-term momentum and routine consistency trajectory."
              />
            </h3>
            <p className="text-xs text-white/50 font-light mt-0.5">
              Smooths daily fluctuations to reveal long-term momentum and habit trajectory over 7-day rolling windows.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#10b981] bg-white/5 px-3 py-1.5 rounded-sm border border border-[#10b981]/30 self-start sm:self-auto">
            <Zap className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Target 7D MA: &ge; 8.0</span>
          </div>
        </div>

        {/* 7-Day Moving Average Stat Callouts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-black/60 border border-white/10 p-4 rounded-md">
            <p className="text-[9px] text-white/40 uppercase font-mono tracking-widest mb-1">
              Latest 7D Moving Avg
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light font-mono text-[#10b981]">{latestMA}</span>
              <span className="text-xs text-white/30 font-mono">/ 10</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono mt-1">
              {maDiff > 0 ? (
                <>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">+{maDiff} vs yesterday</span>
                </>
              ) : maDiff < 0 ? (
                <>
                  <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-red-400">{maDiff} vs yesterday</span>
                </>
              ) : (
                <>
                  <Minus className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-white/40">Unchanged</span>
                </>
              )}
            </div>
          </div>

          <div className="bg-black/60 border border-white/10 p-4 rounded-md">
            <p className="text-[9px] text-white/40 uppercase font-mono tracking-widest mb-1">
              Peak 7D Rolling Average
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light font-mono text-white">{peakMA}</span>
              <span className="text-xs text-white/30 font-mono">/ 10</span>
            </div>
            <p className="text-[10px] text-white/40 font-mono tracking-wider uppercase mt-1">
              Highest momentum achieved
            </p>
          </div>

          <div className="bg-black/60 border border-white/10 p-4 rounded-md">
            <p className="text-[9px] text-white/40 uppercase font-mono tracking-widest mb-1">
              Floor 7D Rolling Average
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light font-mono text-white">{minMA}</span>
              <span className="text-xs text-white/30 font-mono">/ 10</span>
            </div>
            <p className="text-[10px] text-white/40 font-mono tracking-wider uppercase mt-1">
              Baseline consistency floor
            </p>
          </div>

          <div className="bg-black/60 border border-white/10 p-4 rounded-md">
            <p className="text-[9px] text-white/40 uppercase font-mono tracking-widest mb-1">
              Evaluated Logs
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light font-mono text-[#10b981]">{chartData.length}</span>
              <span className="text-xs text-white/30 font-mono">days</span>
            </div>
            <p className="text-[10px] text-white/40 font-mono tracking-wider uppercase mt-1">
              {chartData.length >= 7 ? 'Full 7-day window active' : `${chartData.length}/7 days window building`}
            </p>
          </div>
        </div>

        {/* 7-Day Moving Average Line Chart */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-white/60">
            <span className="uppercase tracking-wider">7-Day Moving Avg vs. Daily Score</span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#10b981] rounded-full inline-block" />
                <span className="text-white/80">7D Moving Average</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-white/40 border-t border-dashed border-white/60 inline-block" />
                <span className="text-white/50">Daily Score</span>
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" stroke="#666" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 10]} stroke="#666" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0a0a',
                    borderColor: 'rgba(197, 160, 89, 0.4)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                  formatter={(value: any, name: any) => [
                    `${value} / 10`,
                    name === 'movingAverage' ? '7-Day Moving Avg' : 'Daily Habit Score',
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontFamily: 'monospace' }} />
                <Line
                  type="monotone"
                  dataKey="habitScore"
                  name="Daily Score"
                  stroke="#666666"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  dot={{ fill: '#666666', r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="movingAverage"
                  name="7-Day Moving Avg"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 7, fill: '#34d399' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rolling Window Details Breakdown */}
        <div className="pt-2 border-t border-white/10">
          <h4 className="text-xs font-mono uppercase tracking-widest text-white/50 mb-3">
            Recent 7-Day Rolling Window Breakdown
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 font-mono text-xs">
            {chartData.slice(-6).reverse().map((item) => (
              <div
                key={item.fullDate}
                className="bg-black/40 border border-white/10 p-2.5 rounded-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] text-white/40 block mb-1">{item.date}</span>
                  <span className="text-sm font-semibold text-[#10b981] block">
                    {item.movingAverage} <span className="text-[10px] text-white/30">MA</span>
                  </span>
                </div>
                <div className="mt-2 text-[10px] text-white/50 border-t border-white/5 pt-1 flex justify-between">
                  <span>Daily:</span>
                  <span className="text-white font-bold">{item.habitScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Row 2: Macros & Coding Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calories & Protein Bar Chart */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-serif italic text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#10b981]" />
              <span>Calories & Protein Tracking</span>
            </h3>
            <span className="text-[10px] font-mono text-white/40 uppercase">Daily Extracted</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" stroke="#666" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" orientation="left" stroke="#10b981" fontSize={11} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#e0e0e0" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0a0a',
                    borderColor: 'rgba(197, 160, 89, 0.4)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontFamily: 'monospace' }} />
                <Bar yAxisId="left" dataKey="calories" name="Calories (kcal)" fill="#10b981" radius={[2, 2, 0, 0]} />
                <Bar yAxisId="right" dataKey="protein" name="Protein (g)" fill="#888888" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deep Work / Study Hours Bar Chart */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-serif italic text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-[#10b981]" />
              <span>Deep Work & Study Hours</span>
            </h3>
            <span className="text-[10px] font-mono text-white/40 uppercase">Hours / Day</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" stroke="#666" fontSize={11} tickLine={false} />
                <YAxis stroke="#666" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0a0a',
                    borderColor: 'rgba(197, 160, 89, 0.4)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="studyHours" name="Study / Coding (hrs)" radius={[2, 2, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.studyHours >= 4 ? '#10b981' : entry.studyHours >= 2 ? '#8e7033' : '#55431d'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

