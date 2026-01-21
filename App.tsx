
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { Subject, UserProfile, AttendanceStatus } from './types';
import { formatDate } from './utils/attendance';
import { Icons } from './constants';

const LOCAL_STORAGE_KEY = 'attendly_data_v4'; // Bump version for schema change
const THEME_MODE_KEY = 'attendly_theme_mode';

const INITIAL_PROFILE: UserProfile = {
  name: '',
  rollNumber: '',
  institution: '',
  overallTarget: 75,
  theme: 'modern'
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile'>('dashboard');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem(THEME_MODE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = savedMode ? savedMode === 'dark' : prefersDark;
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');

    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    const legacyV3 = localStorage.getItem('attendly_data_v3');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSubjects(parsed.subjects || []);
        setProfile({ ...INITIAL_PROFILE, ...(parsed.profile || {}) });
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    } else if (legacyV3) {
      // Migrate from single status to array
      try {
        const parsed = JSON.parse(legacyV3);
        const migratedSubjects = (parsed.subjects || []).map((s: any) => {
          const newHistory: Record<string, AttendanceStatus[]> = {};
          Object.entries(s.history || {}).forEach(([date, status]) => {
            newHistory[date] = [status as AttendanceStatus];
          });
          return { ...s, history: newHistory };
        });
        setSubjects(migratedSubjects);
        setProfile({ ...INITIAL_PROFILE, ...(parsed.profile || {}) });
      } catch (e) {
        console.error("Migration failed", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const body = document.body;
      body.classList.remove('theme-modern', 'theme-retro');
      body.classList.add(`theme-${profile.theme}`);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ subjects, profile }));
    }
  }, [subjects, profile, isLoaded]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem(THEME_MODE_KEY, next ? 'dark' : 'light');
    if (next) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const handleUpdateAttendance = (id: string, status: AttendanceStatus, date?: string, index?: number) => {
    const dateStr = date || formatDate(new Date());
    setSubjects(prev => prev.map(sub => {
      if (sub.id !== id) return sub;
      const newHistory = { ...sub.history };
      const daySessions = [...(newHistory[dateStr] || [])];

      if (index !== undefined) {
        // Edit or Remove specific slot
        if (status === 'NONE') {
          daySessions.splice(index, 1);
        } else {
          daySessions[index] = status;
        }
      } else {
        // Add new slot (Quick Action or Calendar Add)
        if (status !== 'NONE') {
          daySessions.push(status);
        }
      }

      if (daySessions.length === 0) delete newHistory[dateStr];
      else newHistory[dateStr] = daySessions;

      return { ...sub, history: newHistory, lastUpdated: Date.now() };
    }));
  };

  const handleAddSubject = (name: string, target: number) => {
    setSubjects(prev => [{
      id: crypto.randomUUID(),
      name,
      target,
      history: {},
      lastUpdated: Date.now()
    }, ...prev]);
  };

  const handleDeleteSubject = (id: string) => {
    if (window.confirm("Delete this subject?")) {
      setSubjects(prev => prev.filter(sub => sub.id !== id));
    }
  };

  const exportData = () => {
    const data = JSON.stringify({ subjects, profile }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendly_backup_${formatDate(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.subjects && parsed.profile && window.confirm("Overwrite current data?")) {
          setSubjects(parsed.subjects);
          setProfile(parsed.profile);
        }
      } catch (err) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (!isLoaded) return null;

  return (
    <div className="relative min-h-screen">
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'dashboard' ? (
          <Dashboard 
            subjects={subjects} 
            profile={profile}
            onUpdateAttendance={handleUpdateAttendance}
            onAddSubject={handleAddSubject}
            onDeleteSubject={handleDeleteSubject}
          />
        ) : (
          <Profile 
            profile={profile}
            onUpdate={setProfile}
            onExport={exportData}
            onImport={importData}
          />
        )}
      </Layout>
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-6 right-6 z-[100] p-4 rounded-full bg-white dark:bg-slate-800 text-primary shadow-2xl border border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {darkMode ? <Icons.Sun /> : <Icons.Moon />}
      </button>
    </div>
  );
};

export default App;
