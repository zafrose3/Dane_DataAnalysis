import React from 'react';
import { Icons } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'profile';
  setActiveTab: (tab: 'dashboard' | 'profile') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-transparent transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky top-0 h-screen transition-colors duration-300">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="bg-primary text-white p-1.5 rounded-lg shadow-sm">
              <Icons.Layout />
            </span>
            Attendly
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Icons.Layout />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Icons.User />
            Profile
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 transition-colors">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase mb-1">Status</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Synced Locally</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
          <h1 className="text-xl font-bold text-primary">Attendly</h1>
          <button onClick={() => setActiveTab('profile')} className="p-2 text-slate-600 dark:text-slate-400">
            <Icons.User />
          </button>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around p-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-colors">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}
          >
            <Icons.Layout />
            <span className="text-[10px] font-bold uppercase">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}
          >
            <Icons.User />
            <span className="text-[10px] font-bold uppercase">Profile</span>
          </button>
        </nav>
      </main>
    </div>
  );
};
