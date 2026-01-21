
import React from 'react';
import { Subject, AttendanceStatus } from '../types';
import { Icons } from '../constants';
import { getAttendanceStats } from '../utils/attendance';

interface SubjectCardProps {
  subject: Subject;
  onUpdate: (id: string, status: AttendanceStatus) => void;
  onDelete: (id: string) => void;
  onOpenCalendar: (id: string) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onUpdate, onDelete, onOpenCalendar }) => {
  const { present, absent, od, holiday, percentage, total, attended } = getAttendanceStats(subject);
  
  const isSafe = percentage >= subject.target;

  const getStatusText = () => {
    if (total === 0) return "Add today's classes below!";
    if (percentage < subject.target) {
      let currAttended = attended;
      let currTotal = total;
      let count = 0;
      while ((currAttended / currTotal) * 100 < subject.target) {
        currAttended++;
        currTotal++;
        count++;
      }
      return `Attend ${count} more to reach ${subject.target}%`;
    } else {
      let currAttended = attended;
      let currTotal = total;
      let count = 0;
      while (((currAttended) / (currTotal + 1)) * 100 >= subject.target) {
        currTotal++;
        count++;
      }
      return count === 0 ? "You are at your target limit." : `Safe to skip ${count} more classes.`;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all glass-card group">
      <div className="flex justify-between items-start mb-4">
        <div className="max-w-[70%]">
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 truncate">{subject.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">Goal: {subject.target}%</p>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => onOpenCalendar(subject.id)}
            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="History"
          >
            <Icons.Calendar />
          </button>
          <button 
            onClick={() => onDelete(subject.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Icons.Trash />
          </button>
        </div>
      </div>

      <div className="flex items-end gap-3 mb-6">
        <span className="text-3xl font-black text-slate-900 dark:text-white">{percentage.toFixed(1)}%</span>
        <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase mb-1.5 ${isSafe ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
          {isSafe ? 'Healthy' : 'Warning'}
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-700 ${isSafe ? 'bg-primary' : 'bg-red-500'}`} 
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
        <p className={`text-xs font-bold ${isSafe ? 'text-primary' : 'text-amber-600 dark:text-amber-400'}`}>
          {getStatusText()}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        <AttendanceButton label="Add Pres" count={present} color="emerald" onClick={() => onUpdate(subject.id, 'PRESENT')} />
        <AttendanceButton label="Add Abs" count={absent} color="red" onClick={() => onUpdate(subject.id, 'ABSENT')} />
        <AttendanceButton label="Add OD" count={od} color="blue" onClick={() => onUpdate(subject.id, 'OD')} />
        <AttendanceButton label="Add Hol" count={holiday} color="amber" onClick={() => onUpdate(subject.id, 'HOLIDAY')} />
      </div>
      <p className="text-[9px] text-center text-slate-400 mt-2 font-bold uppercase tracking-widest">Add class for today</p>
    </div>
  );
};

const AttendanceButton: React.FC<{ 
  label: string; 
  count: number; 
  color: 'emerald' | 'red' | 'blue' | 'amber';
  onClick: () => void;
}> = ({ label, count, color, onClick }) => {
  const colorMap = {
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 active:scale-95',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 active:scale-95',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 active:scale-95',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 active:scale-95'
  };

  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all ${colorMap[color]}`}
    >
      <span className="text-sm font-black">{count}</span>
      <span className="text-[8px] uppercase font-black tracking-tight">{label}</span>
    </button>
  );
};
