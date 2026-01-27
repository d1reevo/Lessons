import React, { useState, useEffect } from 'react';
import { List, LayoutGrid, Table2, ExternalLink } from 'lucide-react';
import { LinkStorage, ScheduleViewMode, LessonStatus } from '../types';
import { SCHEDULE, TIME_SLOTS, DAY_INFO, STORAGE_KEYS } from '../constants';
import SubjectIcon from './SubjectIcon';

interface FullScheduleViewProps {
  links: LinkStorage;
  currentTime: Date;
}

const FullScheduleView: React.FC<FullScheduleViewProps> = ({ links, currentTime }) => {
  const [viewMode, setViewMode] = useState<ScheduleViewMode>('list');

  const getLessonStatus = (dayIndex: number, lessonIndex: number): LessonStatus => {
    const todayIndex = currentTime.getDay() - 1; // 0 = Monday
    const isToday = dayIndex === todayIndex;
    
    if (!isToday) {
      return { isLive: false, isUpcoming: false, isPast: false };
    }

    const timeSlot = TIME_SLOTS[lessonIndex];
    if (!timeSlot) return { isLive: false, isUpcoming: false, isPast: false };
    
    const [startHour, startMin] = timeSlot.start.split(':').map(Number);
    const [endHour, endMin] = timeSlot.end.split(':').map(Number);

    const lessonStart = new Date(currentTime);
    lessonStart.setHours(startHour, startMin, 0, 0);

    const lessonEnd = new Date(currentTime);
    lessonEnd.setHours(endHour, endMin, 0, 0);

    const isLive = currentTime >= lessonStart && currentTime < lessonEnd;
    const isPast = currentTime >= lessonEnd;
    const isUpcoming = currentTime < lessonStart;

    return { isLive, isUpcoming, isPast };
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.scheduleViewMode);
    if (saved === 'list' || saved === 'compact' || saved === 'table') {
      setViewMode(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.scheduleViewMode, viewMode);
  }, [viewMode]);

  const handleJoinClick = (subject: string) => {
    if (links[subject]) {
      window.open(links[subject], '_blank', 'noopener,noreferrer');
    }
  };

  const viewModes = [
    { mode: 'list' as ScheduleViewMode, icon: List, label: 'Список' },
    { mode: 'compact' as ScheduleViewMode, icon: LayoutGrid, label: 'Компакт' },
    { mode: 'table' as ScheduleViewMode, icon: Table2, label: 'Таблиця' },
  ];

  // List View
  const ListView = () => (
    <div className="space-y-6">
      {SCHEDULE.map((day) => {
        const todayIndex = currentTime.getDay() - 1;
        const isToday = day.dayIndex === todayIndex;
        
        return (
          <div key={day.dayName}>
            <h3 className="text-xl font-bold text-white mb-4 sticky top-[140px] bg-[#0f0f1a] py-2 z-10 flex items-center gap-3">
              {day.dayNameUk}
              {isToday && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-medium">
                  Сьогодні
                </span>
              )}
            </h3>
            <div className="space-y-2">
              {day.lessons.map((lesson, index) => {
                const status = getLessonStatus(day.dayIndex, index);
                
                return (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                      status.isLive
                        ? 'bg-indigo-500/20 border-2 border-indigo-500 shadow-lg shadow-indigo-500/20'
                        : 'bg-[#1a1a2e] border border-[#2a2a4a]'
                    }`}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium ${
                      status.isLive ? 'bg-indigo-500 text-white' : 'bg-[#252545] text-gray-400'
                    }`}>
                      {index + 1}.
                    </div>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${
                      status.isLive ? 'bg-indigo-500/30 text-indigo-300' : 'bg-[#252545] text-indigo-400'
                    }`}>
                      <SubjectIcon subject={lesson.subject} size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-semibold ${status.isLive ? 'text-white' : 'text-white'}`}>{lesson.subject}</h4>
                        {status.isLive && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                            Зараз
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`text-sm ${status.isLive ? 'text-indigo-300' : 'text-gray-500'}`}>
                      {TIME_SLOTS[index]?.start} - {TIME_SLOTS[index]?.end}
                    </div>
                    {links[lesson.subject] && (
                      <button
                        onClick={() => handleJoinClick(lesson.subject)}
                        className={`p-2 rounded-lg transition-colors ${
                          status.isLive
                            ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                            : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'
                        }`}
                      >
                        <ExternalLink size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Compact View
  const CompactView = () => {
    const todayIndex = currentTime.getDay() - 1;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SCHEDULE.map((day) => {
          const isToday = day.dayIndex === todayIndex;
          
          return (
            <div
              key={day.dayName}
              className={`rounded-2xl overflow-hidden ${
                isToday
                  ? 'bg-[#1a1a2e] border-2 border-indigo-500'
                  : 'bg-[#1a1a2e] border border-[#2a2a4a]'
              }`}
            >
              <div className={`p-4 border-b border-[#2a2a4a] ${
                isToday ? 'bg-indigo-500/20' : 'bg-[#252545]'
              }`}>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white">{day.dayNameUk}</h3>
                  {isToday && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-xs">
                      Сьогодні
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{day.lessons.length} уроків</p>
              </div>
              <div className="p-3 space-y-1">
                {day.lessons.map((lesson, index) => {
                  const status = getLessonStatus(day.dayIndex, index);
                  
                  return (
                    <div
                      key={lesson.id}
                      className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                        status.isLive
                          ? 'bg-indigo-500/30 border border-indigo-500'
                          : 'hover:bg-[#252545]'
                      }`}
                    >
                      <span className={`w-5 text-xs font-mono ${
                        status.isLive ? 'text-indigo-300' : 'text-gray-500'
                      }`}>{index + 1}.</span>
                      <SubjectIcon subject={lesson.subject} size={14} className={status.isLive ? 'text-indigo-300' : 'text-indigo-400'} />
                      <span className={`flex-1 text-sm truncate ${
                        status.isLive ? 'text-white font-medium' : 'text-gray-300'
                      }`}>{lesson.subject}</span>
                      {status.isLive && (
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      )}
                      {!status.isLive && links[lesson.subject] && (
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Table View
  const TableView = () => {
    const todayIndex = currentTime.getDay() - 1;
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    return (
      <div className="rounded-2xl bg-[#1a1a2e] border border-[#2a2a4a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-[#252545]">
                <th className="p-3 text-left text-sm font-semibold text-gray-400 w-16">№</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-400 w-24">Час</th>
                {dayNames.map((dayName, idx) => (
                  <th key={dayName} className={`p-3 text-left text-sm font-semibold ${
                    idx === todayIndex ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-400'
                  }`}>
                    {DAY_INFO[dayName].uk}
                    {idx === todayIndex && (
                      <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-indigo-500/20">Сьогодні</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, index) => (
                <tr key={slot.id} className="border-t border-[#2a2a4a] hover:bg-[#252545]/50 transition-colors">
                  <td className="p-3 font-medium text-gray-500">{index + 1}</td>
                  <td className="p-3 text-sm text-gray-500 whitespace-nowrap">{slot.start}</td>
                  {SCHEDULE.map((day) => {
                    const lesson = day.lessons[index];
                    const status = getLessonStatus(day.dayIndex, index);
                    const isToday = day.dayIndex === todayIndex;
                    
                    return (
                      <td key={`${day.dayName}-${index}`} className={`p-3 ${
                        status.isLive
                          ? 'bg-indigo-500/20'
                          : isToday
                            ? 'bg-indigo-500/5'
                            : ''
                      }`}>
                        {lesson && (
                          <div className={`flex items-center gap-2 ${
                            status.isLive ? 'p-1.5 rounded-lg bg-indigo-500/30 border border-indigo-500' : ''
                          }`}>
                            {status.isLive && (
                              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                            )}
                            <SubjectIcon subject={lesson.subject} size={14} className={status.isLive ? 'text-indigo-300 flex-shrink-0' : 'text-indigo-400 flex-shrink-0'} />
                            <span className={`text-sm truncate ${
                              status.isLive ? 'text-white font-medium' : 'text-gray-300'
                            }`}>{lesson.subject}</span>
                            {links[lesson.subject] && (
                              <button
                                onClick={() => handleJoinClick(lesson.subject)}
                                className={`p-1 rounded transition-colors flex-shrink-0 ${
                                  status.isLive
                                    ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                                    : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'
                                }`}
                              >
                                <ExternalLink size={12} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderView = () => {
    switch (viewMode) {
      case 'list': return <ListView />;
      case 'compact': return <CompactView />;
      case 'table': return <TableView />;
      default: return <ListView />;
    }
  };

  return (
    <div className="space-y-6">
      {/* View Mode Switcher */}
      <div className="flex bg-[#1a1a2e] rounded-2xl p-1.5 w-fit">
        {viewModes.map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all
              ${viewMode === mode
                ? 'bg-[#252545] text-white'
                : 'text-gray-400 hover:text-white'
              }
            `}
          >
            <Icon size={18} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Schedule View */}
      {renderView()}
    </div>
  );
};

export default FullScheduleView;
