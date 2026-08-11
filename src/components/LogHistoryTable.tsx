import React, { useState } from 'react';
import {
  Database,
  Trash2,
  Copy,
  FileCode,
  XCircle,
  Dumbbell,
  Search,
  Check,
  Download,
} from 'lucide-react';
import { RoutineLogMetrics } from '../types';

interface LogHistoryTableProps {
  logs: RoutineLogMetrics[];
  onDeleteLog: (id: string) => void;
  onClearAll: () => void;
}

export const LogHistoryTable: React.FC<LogHistoryTableProps> = ({
  logs,
  onDeleteLog,
  onClearAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'workout' | 'rest'>('all');
  const [selectedLogForJson, setSelectedLogForJson] = useState<RoutineLogMetrics | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.raw_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.workout_focus &&
        log.workout_focus.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.date.includes(searchTerm);

    if (filterType === 'workout') return matchesSearch && log.workout_done;
    if (filterType === 'rest') return matchesSearch && !log.workout_done;
    return matchesSearch;
  });

  const handleCopyJson = (log: RoutineLogMetrics) => {
    const jsonToCopy = JSON.stringify(
      {
        date: log.date,
        workout_done: log.workout_done,
        workout_focus: log.workout_focus,
        calories_estimated: log.calories_estimated,
        protein_grams: log.protein_grams,
        study_or_coding_hours: log.study_or_coding_hours,
        habit_score: log.habit_score,
      },
      null,
      2
    );

    navigator.clipboard.writeText(jsonToCopy);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const exportData = filteredLogs.length > 0 ? filteredLogs : logs;
    if (exportData.length === 0) return;

    const headers = [
      'Date',
      'Workout Done',
      'Workout Focus',
      'Calories (kcal)',
      'Protein (g)',
      'Study/Coding Hours',
      'Habit Score',
      'Raw Log Input',
    ];

    const escapeCsv = (str: string | null | undefined) => {
      if (str === null || str === undefined) return '""';
      const escaped = String(str).replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const csvRows = [
      headers.join(','),
      ...exportData.map((log) =>
        [
          escapeCsv(log.date),
          log.workout_done ? 'true' : 'false',
          escapeCsv(log.workout_focus || ''),
          log.calories_estimated !== null && log.calories_estimated !== undefined ? log.calories_estimated : '',
          log.protein_grams !== null && log.protein_grams !== undefined ? log.protein_grams : '',
          log.study_or_coding_hours,
          log.habit_score,
          escapeCsv(log.raw_text),
        ].join(',')
      ),
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `aegis_habit_logs_${new Date().toISOString().substring(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-sm bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif italic text-white">
                Database Sync Payload Logs
              </h2>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-mono">
                Structured Metrics Extracted via Gemini API
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {logs.length > 0 && (
              <>
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded-sm bg-[#10b981] hover:bg-[#34d399] text-black font-semibold text-xs font-mono uppercase tracking-widest flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Export currently displayed logs to CSV file"
                >
                  <Download className="w-3.5 h-3.5 fill-black" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={onClearAll}
                  className="px-3 py-1.5 rounded-sm bg-red-950/40 border border-red-800/40 text-xs font-mono uppercase tracking-widest text-red-300 hover:bg-red-900/60 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Logs</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs by keyword, focus, or date..."
              className="w-full bg-white/5 border border-white/20 rounded-sm pl-9 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#10b981] transition-all font-sans"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-black p-1 rounded-sm border border-white/10 w-full sm:w-auto font-mono text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-sm uppercase tracking-wider transition-colors ${
                filterType === 'all'
                  ? 'bg-white/10 text-[#10b981]'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              All ({logs.length})
            </button>
            <button
              onClick={() => setFilterType('workout')}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-sm uppercase tracking-wider transition-colors ${
                filterType === 'workout'
                  ? 'bg-white/10 text-[#10b981]'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Workouts
            </button>
            <button
              onClick={() => setFilterType('rest')}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-sm uppercase tracking-wider transition-colors ${
                filterType === 'rest'
                  ? 'bg-white/10 text-[#10b981]'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Rest
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table / Cards */}
      <div className="bg-[#0d0d0d] border border-white/10 rounded-lg shadow-2xl overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-white/40 text-xs font-mono">
            No matching log entries found in database.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-5 hover:bg-white/5 transition-colors space-y-3"
              >
                {/* Row Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#10b981] bg-white/5 px-2.5 py-1 rounded-sm border border-[#10b981]/30">
                      {log.date}
                    </span>

                    {log.workout_done ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white/5 border border-white/10 text-xs font-serif text-white">
                        <Dumbbell className="w-3.5 h-3.5 text-[#10b981]" />
                        <span>{log.workout_focus || 'Workout Completed'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white/5 border border-white/10 text-xs font-serif text-white/50">
                        <XCircle className="w-3.5 h-3.5 text-white/30" />
                        <span>Rest / Recovery</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Habit Score Badge */}
                    <div className="px-2.5 py-1 rounded-sm bg-black border border-white/10 text-xs font-mono text-white/80">
                      Score: <span className="text-[#10b981] font-bold">{log.habit_score}/10</span>
                    </div>

                    <button
                      onClick={() => setSelectedLogForJson(log)}
                      className="p-1.5 rounded-sm bg-black hover:bg-white/10 border border-white/10 text-white/60 hover:text-[#10b981] transition-colors"
                      title="Inspect extracted JSON"
                    >
                      <FileCode className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleCopyJson(log)}
                      className="p-1.5 rounded-sm bg-black hover:bg-white/10 border border-white/10 text-white/60 hover:text-[#10b981] transition-colors"
                      title="Copy JSON"
                    >
                      {copiedId === log.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => onDeleteLog(log.id)}
                      className="p-1.5 rounded-sm bg-black hover:bg-red-950/60 border border-white/10 text-white/60 hover:text-red-400 transition-colors"
                      title="Delete log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Raw Input Log text */}
                <div className="bg-white/5 p-3.5 rounded-md border border-white/5 text-xs text-white/80 italic font-sans leading-relaxed">
                  "{log.raw_text}"
                </div>

                {/* Extracted JSON schema preview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="bg-black p-2 rounded-sm border border-white/10">
                    <span className="text-white/40 text-[9px] block uppercase tracking-widest">
                      Calories
                    </span>
                    <span className="text-[#10b981]">
                      {log.calories_estimated ? `${log.calories_estimated} kcal` : 'null'}
                    </span>
                  </div>

                  <div className="bg-black p-2 rounded-sm border border-white/10">
                    <span className="text-white/40 text-[9px] block uppercase tracking-widest">
                      Protein
                    </span>
                    <span className="text-[#10b981]">
                      {log.protein_grams ? `${log.protein_grams}g` : 'null'}
                    </span>
                  </div>

                  <div className="bg-black p-2 rounded-sm border border-white/10">
                    <span className="text-white/40 text-[9px] block uppercase tracking-widest">
                      Work Hours
                    </span>
                    <span className="text-white">
                      {log.study_or_coding_hours} hrs
                    </span>
                  </div>

                  <div className="bg-black p-2 rounded-sm border border-white/10">
                    <span className="text-white/40 text-[9px] block uppercase tracking-widest">
                      Workout
                    </span>
                    <span className={log.workout_done ? 'text-emerald-400' : 'text-white/40'}>
                      {log.workout_done ? 'true' : 'false'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* JSON Inspector Modal */}
      {selectedLogForJson && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] border border-white/10 rounded-lg max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-serif italic text-white">
                  Database Sync Payload ({selectedLogForJson.date})
                </h3>
              </div>
              <button
                onClick={() => setSelectedLogForJson(null)}
                className="text-white/50 hover:text-white text-xs font-mono px-2 py-1 rounded bg-white/10"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-white/60 font-light">
              Structured JSON schema extracted automatically from plain text for backend database insertion:
            </p>

            <div className="p-4 bg-black rounded-md border border-white/10 font-mono text-xs text-emerald-400/90 overflow-x-auto leading-relaxed">
              <pre>
                {JSON.stringify(
                  {
                    date: selectedLogForJson.date,
                    workout_done: selectedLogForJson.workout_done,
                    workout_focus: selectedLogForJson.workout_focus,
                    calories_estimated: selectedLogForJson.calories_estimated,
                    protein_grams: selectedLogForJson.protein_grams,
                    study_or_coding_hours: selectedLogForJson.study_or_coding_hours,
                    habit_score: selectedLogForJson.habit_score,
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleCopyJson(selectedLogForJson)}
                className="px-4 py-2 rounded-sm bg-[#10b981] hover:bg-[#34d399] text-black font-semibold text-xs font-mono uppercase tracking-widest flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Payload</span>
              </button>
              <button
                onClick={() => setSelectedLogForJson(null)}
                className="px-4 py-2 rounded-sm bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-widest transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

