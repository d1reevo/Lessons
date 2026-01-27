// App.tsx - Main component with routing/tabs

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Settings, Calendar, LayoutGrid } from 'lucide-react';
import { ViewMode, Theme, LinkStorage } from './types';
import { SCHEDULE, STORAGE_KEYS, APP_CONFIG } from './constants';
import Dashboard from './components/Dashboard';
import DayCard from './components/DayCard';
import FullScheduleView from './components/FullScheduleView';
import LinkManager from './components/LinkManager';

const App: React.FC = () => {
  // State
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [theme, setTheme] = useState<Theme>('light');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [links, setLinks] = useState<LinkStorage>({});
  
  // Link Manager Modal State
  const [isLinkManagerOpen, setIsLinkManagerOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');

  // Load persisted data
  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    // Load links
    const savedLinks = localStorage.getItem(STORAGE_KEYS.links);
    if (savedLinks) {
      try {
        setLinks(JSON.parse(savedLinks));
      } catch (e) {
        console.error('Failed to parse saved links');
      }
    }

    // Load view mode
    const savedViewMode = localStorage.getItem(STORAGE_KEYS.viewMode);
    if (savedViewMode === 'daily' || savedViewMode === 'full') {
      setViewMode(savedViewMode);
    }
  }, []);

  // Persist theme
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Persist links
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.links, JSON.stringify(links));
  }, [links]);

  // Persist view mode
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.viewMode, viewMode);
  }, [viewMode]);

  // Update current time every minute for day calculations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const openLinkManager = (subject: string) => {
    setSelectedSubject(subject);
    setIsLinkManagerOpen(true);
  };

  const handleSaveLink = (subject: string, link: string) => {
    if (link.trim()) {
      setLinks((prev) => ({ ...prev, [subject]: link.trim() }));
    } else {
      const newLinks = { ...links };
      delete newLinks[subject];
      setLinks(newLinks);
    }
  };

  const handleDeleteLink = (subject: string) => {
    const newLinks = { ...links };
    delete newLinks[subject];
    setLinks(newLinks);
  };

  // Check if today is a weekday
  const todayIndex = currentTime.getDay() - 1; // 0 = Monday, 4 = Friday
  const isDark = theme === 'dark';

  return (
    <div
      className={`
        min-h-screen transition-colors duration-300
        ${isDark 
          ? 'bg-gray-900 text-white' 
          : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900'
        }
      `}
    >
      {/* Header */}
      <header
        className={`
          sticky top-0 z-40 backdrop-blur-xl border-b
          ${isDark 
            ? 'bg-gray-900/80 border-gray-800' 
            : 'bg-white/80 border-gray-200'
          }
        `}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div
                className={`
                  w-12 h-12 flex items-center justify-center rounded-2xl font-bold text-lg
                  bg-gradient-to-br from-blue-500 to-indigo-600 text-white
                `}
              >
                8Б
              </div>
              <div>
                <h1 className="text-xl font-bold">{APP_CONFIG.groupName}</h1>
                <p
                  className={`
                    text-sm
                    ${isDark ? 'text-gray-400' : 'text-gray-500'}
                  `}
                >
                  {APP_CONFIG.groupNumber}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`
                  p-3 rounded-2xl transition-all duration-200
                  ${isDark 
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }
                `}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* Settings */}
              <button
                className={`
                  p-3 rounded-2xl transition-all duration-200
                  ${isDark 
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }
                `}
                title="Settings"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-4">
            <div
              className={`
                inline-flex p-1.5 rounded-2xl
                ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
              `}
            >
              <button
                onClick={() => setViewMode('daily')}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium
                  transition-all duration-200
                  ${viewMode === 'daily'
                    ? isDark
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-blue-600 shadow-md'
                    : isDark
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }
                `}
              >
                <Calendar size={18} />
                <span>Інтерактивний</span>
              </button>
              <button
                onClick={() => setViewMode('full')}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium
                  transition-all duration-200
                  ${viewMode === 'full'
                    ? isDark
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-blue-600 shadow-md'
                    : isDark
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }
                `}
              >
                <LayoutGrid size={18} />
                <span>Повний розклад</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {viewMode === 'daily' ? (
          <>
            {/* Dashboard Widget */}
            <Dashboard theme={theme} />

            {/* Day Cards */}
            <div className="space-y-4">
              <h2
                className={`
                  text-lg font-semibold
                  ${isDark ? 'text-gray-300' : 'text-gray-700'}
                `}
              >
                Розклад по днях
              </h2>
              {SCHEDULE.map((day) => (
                <DayCard
                  key={day.dayName}
                  day={day}
                  isToday={day.dayIndex === todayIndex}
                  currentTime={currentTime}
                  links={links}
                  onOpenLinkManager={openLinkManager}
                  theme={theme}
                  defaultExpanded={day.dayIndex === todayIndex}
                />
              ))}
            </div>
          </>
        ) : (
          <FullScheduleView
            links={links}
            onOpenLinkManager={openLinkManager}
            theme={theme}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        className={`
          py-6 mt-8 border-t
          ${isDark ? 'border-gray-800' : 'border-gray-200'}
        `}
      >
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p
            className={`
              text-sm
              ${isDark ? 'text-gray-500' : 'text-gray-400'}
            `}
          >
            {APP_CONFIG.groupName} ({APP_CONFIG.groupNumber}) • Розклад уроків
          </p>
        </div>
      </footer>

      {/* Link Manager Modal */}
      <LinkManager
        isOpen={isLinkManagerOpen}
        subject={selectedSubject}
        currentLink={links[selectedSubject] || ''}
        onClose={() => setIsLinkManagerOpen(false)}
        onSave={handleSaveLink}
        onDelete={handleDeleteLink}
        theme={theme}
      />
    </div>
  );
};

export default App;
