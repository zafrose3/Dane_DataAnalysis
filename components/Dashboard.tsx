import React, { useState } from 'react';
import { Subject, ActionType, UserProfile, AttendanceStatus } from '../types';
import { SubjectCard } from './SubjectCard';
import { CalendarView } from './CalendarView';
import { Icons } from '../constants';
import { getAttendanceStats } from '../utils/attendance';

interface DashboardProps {
  subjects: Subject[];
  profile: UserProfile;
  onUpdateAttendance: (id: string, action: AttendanceStatus, date?: string) => void;
  onAddSubject: (name: string, target: number) => void;
  onDeleteSubject: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  subjects, 
  profile, 
  onUpdateAttendance, 
  onAddSubject,
  onDeleteSubject
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState('');
  const [newSubTarget, setNewSubTarget] = useState(profile.overallTarget);

  const calculateOverall = () => {
    if (subjects.length === 0) return 0;
    const totals = subjects.reduce((acc, sub) => {
      const { attended, total } = getAttendanceStats(sub);
      acc.total += total;
      acc.attended += attended;
      return acc;
    }, { total: 0, attended: 0 });
    return totals.total === 0 ? 0 : (totals.attended / totals.total) * 100;
  };

  const overall = calculateOverall();
  const isHealthy = overall >= profile.overallTarget;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubName.trim()) {
      onAddSubject(newSubName.trim(), newSubTarget);
      setNewSubName('');
      setIsModalOpen(false);
    }
  };

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Hey, {profile.name || 'Student'}! 👋</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Your academic progress at a glance.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-primary hover:primary-hover text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95"
        >
          <Icons.Plus />
          Add Subject
        </button>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors glass-card">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Overall Attendance</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-4xl font-black text-slate-900 dark:text-white">{overall.toFixed(1)}%</h4>
            <span className={`text-sm font-bold ${isHealthy ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {isHealthy ? '↑ Healthy' : '↓ Low'}
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors glass-card">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Goal Target</p>
          <h4 className="text-4xl font-black text-primary">{profile.overallTarget}%</h4>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors glass-card">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Subjects Tracked</p>
          <h4 className="text-4xl font-black text-slate-900 dark:text-white">{subjects.length}</h4>
        </div>
      </div>

      {/* Subjects Grid */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Attendance by Subject</h3>
          <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full text-xs font-bold">
            {subjects.length}
          </span>
        </div>
        
        {subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl glass-card">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full text-slate-400 dark:text-slate-500 mb-4">
              <Icons.Layout />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Start by adding your first subject!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map(sub => (
              <SubjectCard 
                key={sub.id} 
                subject={sub} 
                onUpdate={(id, action) => onUpdateAttendance(id, action as AttendanceStatus)}
                onDelete={onDeleteSubject}
                onOpenCalendar={(id) => setSelectedSubjectId(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden glass-card">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Add New Subject</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 p-1">
                <Icons.X />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Name</label>
                <input 
                  type="text" 
                  autoFocus required
                  placeholder="e.g. Physics"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Target %</label>
                <input 
                  type="number" min="0" max="100"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  value={newSubTarget}
                  onChange={(e) => setNewSubTarget(Number(e.target.value))}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-primary hover:primary-hover shadow-lg transition-all active:scale-95">
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedSubject && (
        <CalendarView 
          subject={selectedSubject}
          onUpdateDate={(date, status) => onUpdateAttendance(selectedSubjectId!, status, date)}
          onClose={() => setSelectedSubjectId(null)}
        />
      )}
    </div>
  );
};
