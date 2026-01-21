
import React, { useState } from 'react';
import { Subject, AttendanceStatus } from '../types';
import { Icons } from '../constants';
import { getMonthDays, formatDate } from '../utils/attendance';

interface CalendarViewProps {
  subject: Subject;
  onUpdateDate: (date: string, status: AttendanceStatus, index?: number) => void;
  onClose: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ subject, onUpdateDate, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayDetail, setSelectedDayDetail] = useState<string | null>(null);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const { firstDay, daysInMonth } = getMonthDays(year, month);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const getDaySummaryColor = (statuses: AttendanceStatus[], isSunday: boolean) => {
    if (!statuses || statuses.length === 0) {
      return isSunday ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-400' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800';
    }
    
    // If multiple sessions, highlight the dominant state or mixed state
    if (statuses.includes('ABSENT') && !isSunday) return 'bg-red-500 text-white';
    if (statuses.includes('PRESENT')) return 'bg-emerald-500 text-white';
    if (statuses.includes('OD')) return 'bg-blue-500 text-white';
    return 'bg-amber-400 text-white';
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const selectedDateSessions = selectedDayDetail ? (subject.history[selectedDayDetail] || []) : [];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden glass-card flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-primary text-white">
          <div>
            <h3 className="text-xl font-black">{subject.name}</h3>
            <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Logs</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <Icons.X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!selectedDayDetail ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-slate-800 dark:text-slate-100 text-lg">{monthName} {year}</h4>
                <div className="flex gap-2">
                  <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                    <Icons.ChevronLeft />
                  </button>
                  <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                    <Icons.ChevronRight />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="text-center text-[10px] font-black text-slate-400 uppercase">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((day, i) => {
                  if (day === null) return <div key={`empty-${i}`} />;
                  const dateObj = new Date(year, month, day);
                  const dateStr = formatDate(dateObj);
                  const isSunday = dateObj.getDay() === 0;
                  const statuses = subject.history[dateStr] || [];
                  
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDayDetail(dateStr)}
                      className={`aspect-square relative flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all hover:scale-105 ${getDaySummaryColor(statuses, isSunday)}`}
                    >
                      {day}
                      {statuses.length > 1 && (
                        <div className="absolute top-1 right-1 bg-black/20 rounded-full w-4 h-4 text-[8px] flex items-center justify-center">
                          {statuses.length}
                        </div>
                      )}
                      {statuses.length === 1 && <div className="w-1 h-1 rounded-full mt-0.5 bg-white/40" />}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <button 
                onClick={() => setSelectedDayDetail(null)}
                className="flex items-center gap-2 text-sm font-bold text-primary mb-4"
              >
                <Icons.ChevronLeft /> Back to Calendar
              </button>
              
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-black text-slate-800 dark:text-white">Classes for {selectedDayDetail}</h4>
              </div>

              <div className="space-y-3">
                {selectedDateSessions.length === 0 ? (
                  <p className="text-center py-8 text-slate-400 font-medium">No classes logged for this day.</p>
                ) : (
                  selectedDateSessions.map((status, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          status === 'PRESENT' ? 'bg-emerald-500' : 
                          status === 'ABSENT' ? 'bg-red-500' : 
                          status === 'OD' ? 'bg-blue-500' : 'bg-amber-400'
                        }`} />
                        <span className="font-bold text-slate-700 dark:text-slate-200">Session {idx + 1}: {status}</span>
                      </div>
                      <button 
                        onClick={() => onUpdateDate(selectedDayDetail, 'NONE', idx)}
                        className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Icons.Trash />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-black uppercase text-slate-400 mb-3 tracking-widest">Add New Class Session</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => onUpdateDate(selectedDayDetail, 'PRESENT')} className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 font-black text-xs uppercase border border-emerald-100 dark:border-emerald-900/40">Present</button>
                  <button onClick={() => onUpdateDate(selectedDayDetail, 'ABSENT')} className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 font-black text-xs uppercase border border-red-100 dark:border-red-900/40">Absent</button>
                  <button onClick={() => onUpdateDate(selectedDayDetail, 'OD')} className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-black text-xs uppercase border border-blue-100 dark:border-blue-900/40">OD</button>
                  <button onClick={() => onUpdateDate(selectedDayDetail, 'HOLIDAY')} className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 font-black text-xs uppercase border border-amber-100 dark:border-amber-900/40">Holiday</button>
                </div>
              </div>
            </div>
          )}

          {!selectedDayDetail && (
            <div className="mt-8 grid grid-cols-2 gap-y-3 gap-x-6 text-[10px] font-black uppercase tracking-wider border-t border-slate-100 dark:border-slate-800 pt-6">
              <div className="flex items-center gap-2 text-emerald-600">
                <div className="w-3 h-3 rounded bg-emerald-500" /> Present
              </div>
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-3 h-3 rounded bg-red-500" /> Absent
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <div className="w-3 h-3 rounded bg-blue-500" /> On Duty (OD)
              </div>
              <div className="flex items-center gap-2 text-amber-600">
                <div className="w-3 h-3 rounded bg-amber-400" /> Holiday
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
