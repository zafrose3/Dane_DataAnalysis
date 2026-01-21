
import React, { useState, useRef } from 'react';
import { UserProfile, AppTheme } from '../types';
import { Icons } from '../constants';

interface ProfileProps {
  profile: UserProfile;
  onUpdate: (newProfile: UserProfile) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const THEMES: { id: AppTheme; name: string; color: string }[] = [
  { id: 'modern', name: 'Modern', color: 'bg-blue-600' },
  { id: 'retro', name: 'Retro', color: 'bg-emerald-500' },
];

export const Profile: React.FC<ProfileProps> = ({ profile, onUpdate, onExport, onImport }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const selectTheme = (themeId: AppTheme) => {
    const updated = { ...formData, theme: themeId };
    setFormData(updated);
    onUpdate(updated);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-black shadow-lg">
          {formData.name.charAt(0) || 'U'}
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{formData.name || 'Your Name'}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">{formData.rollNumber || 'ID Number'}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden glass-card">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <div className="text-primary">
            <Icons.Settings />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Personal Information</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">ID / Roll No</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                value={formData.rollNumber}
                onChange={e => setFormData({...formData, rollNumber: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Institution</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                value={formData.institution}
                onChange={e => setFormData({...formData, institution: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Target %</label>
              <input 
                type="number" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                value={formData.overallTarget}
                onChange={e => setFormData({...formData, overallTarget: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-4">Choose Your Visual Style</label>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => selectTheme(t.id)}
                  className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${formData.theme === t.id ? 'border-primary bg-primary/10' : 'border-transparent bg-slate-50 dark:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}
                >
                  <div className={`w-10 h-10 rounded-full mb-2 border shadow-sm ${t.color}`} />
                  <span className="text-[10px] font-black uppercase text-center">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              Themes update instantly. Save to keep info.
            </p>
            <button 
              type="submit"
              className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white transition-all active:scale-95 ${isSaved ? 'bg-emerald-500' : 'bg-primary hover:primary-hover shadow-lg'}`}
            >
              {isSaved ? 'Saved!' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Data Management Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden glass-card">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <div className="text-primary">
            <Icons.Database />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Data & Backup</h3>
        </div>
        <div className="p-8 space-y-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your data is currently stored locally on this device. Download a backup to prevent data loss or to move your data to another browser.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={onExport}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              <Icons.Download />
              Download Backup
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              <Icons.Upload />
              Restore from File
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onImport} 
              accept=".json" 
              className="hidden" 
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-6 text-center glass-card border-dashed border-2 border-slate-200 dark:border-slate-800">
        <p className="text-slate-600 dark:text-slate-400 text-sm font-medium italic">
          "Don't count the days, make the days count."
        </p>
      </div>
    </div>
  );
};
