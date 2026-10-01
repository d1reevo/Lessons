import React, { useState, useEffect } from 'react';
import { Calendar, List, Sun, Moon, Settings } from 'lucide-react';
import { ViewMode, LinkStorage, DaySchedule } from './types';
import { SCHEDULE, STORAGE_KEYS } from './constants';
import Dashboard from './components/Dashboard';
import DayCard from './components/DayCard';
import FullScheduleView from './components/FullScheduleView';
import SettingsModal from './components/SettingsModal';
import LinkManager from './components/LinkManager';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [links, setLinks] = useState<LinkStorage>({});
  const [schedule, setSchedule] = useState<DaySchedule[]>(() => {
    try {
      const savedSchedule = localStorage.getItem(STORAGE_KEYS.schedule);
      if (!savedSchedule) return SCHEDULE;
      const parsed: unknown = JSON.parse(savedSchedule);
      if (
        Array.isArray(parsed) &&
        parsed.length === SCHEDULE.length &&
        parsed.every((day) =>
          day && Array.isArray(day.lessons) && day.lessons.every((lesson: unknown) =>
            typeof lesson === 'object' && lesson !== null &&
            'subject' in lesson && typeof lesson.subject === 'string',
          ),
        )
      ) return parsed as DaySchedule[];
    } catch {
      // Ignore invalid saved data and use the current default schedule.
    }
    return SCHEDULE;
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isLinkManagerOpen, setIsLinkManagerOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');

  // Load persisted data
  useEffect(() => {
    const savedLinks = localStorage.getItem(STORAGE_KEYS.links);
    if (savedLinks) {
      try {
        setLinks(JSON.parse(savedLinks));
      } catch (e) {
        console.error('Failed to parse saved links');
      }
    }

    const savedViewMode = localStorage.getItem(STORAGE_KEYS.viewMode);
    if (savedViewMode === 'daily' || savedViewMode === 'full') {
      setViewMode(savedViewMode);
    }

    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark');
    }
  }, []);

  // Persist links
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.links, JSON.stringify(links));
  }, [links]);

  // Persist view mode
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.viewMode, viewMode);
  }, [viewMode]);

  // Persist theme
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.schedule, JSON.stringify(schedule));
  }, [schedule]);

  // Update time
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
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

  const todayIndex = currentTime.getDay() - 1;

  return (
    <div className={`min-h-screen bg-[#0a0a12] transition-colors duration-300`}>
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <Calendar size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">8-Б (Група I)</h1>
                <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-medium">Розклад уроків</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl glass-light hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200"
              >
                {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2.5 rounded-xl glass-light hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex glass-light rounded-2xl p-1.5">
            <button
              onClick={() => setViewMode('daily')}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium 
                transition-all duration-300
                ${viewMode === 'daily'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <Calendar size={18} />
              <span>Інтерактивний</span>
            </button>
            <button
              onClick={() => setViewMode('full')}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium 
                transition-all duration-300
                ${viewMode === 'full'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <List size={18} />
              <span>Весь розклад</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {viewMode === 'daily' ? (
          <>
            {/* Dashboard */}
            <Dashboard schedule={schedule} />

            {/* Day Cards */}
            <div className="space-y-4">
              {schedule.map((day) => (
                <DayCard
                  key={day.dayName}
                  day={day}
                  isToday={day.dayIndex === todayIndex}
                  currentTime={currentTime}
                  links={links}
                  onOpenLinkManager={openLinkManager}
                />
              ))}
            </div>
          </>
        ) : (
          <FullScheduleView links={links} currentTime={currentTime} schedule={schedule} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 glass">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            8-Б (Група I) • Розклад уроків
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
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        links={links}
        schedule={schedule}
        onClose={() => setIsSettingsOpen(false)}
        onSaveLink={handleSaveLink}
        onDeleteLink={handleDeleteLink}
        onSaveSchedule={setSchedule}
      />
    </div>
  );
};

export default App;
