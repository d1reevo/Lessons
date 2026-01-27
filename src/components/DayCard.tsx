import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DaySchedule, LinkStorage, LessonStatus } from '../types';
import LessonItem from './LessonItem';
import { TIME_SLOTS } from '../constants';

interface DayCardProps {
  day: DaySchedule;
  isToday: boolean;
  currentTime: Date;
  links: LinkStorage;
  onOpenLinkManager: (subject: string) => void;
}

const DayCard: React.FC<DayCardProps> = ({
  day,
  isToday,
  currentTime,
  links,
  onOpenLinkManager,
}) => {
  const [isExpanded, setIsExpanded] = useState(isToday);

  const getLessonStatus = (lessonIndex: number): LessonStatus => {
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

  return (
    <div className="rounded-3xl overflow-hidden glass border border-white/5">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-all duration-300"
      >
        {/* Day Badge */}
        <div
          className={`
            w-14 h-14 flex items-center justify-center rounded-2xl font-bold text-lg
            transition-all duration-300
            ${isToday 
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20' 
              : 'glass-light text-gray-400 border border-white/5'
            }
          `}
        >
          {day.dayShort}
        </div>

        <div className="flex-1 text-left">
          <h3 className="text-lg font-bold text-white mb-1">{day.dayNameUk}</h3>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg glass-light text-gray-400 text-xs font-medium">
              {day.lessons.length} уроків
            </span>
            {isToday && (
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                Сьогодні
              </span>
            )}
          </div>
        </div>

        <div className={`
          w-10 h-10 flex items-center justify-center rounded-xl transition-transform duration-200
          ${isExpanded ? 'rotate-180' : ''}
        `}>
          <ChevronDown 
            size={22} 
            className="text-gray-400"
          />
        </div>
      </button>

      {/* Content */}
      <div
        className={`
          overflow-hidden transition-all ease-out
          ${isExpanded 
            ? 'max-h-[2000px] opacity-100 duration-500' 
            : 'max-h-0 opacity-0 duration-200'
          }
        `}
      >
        <div className="px-5 pb-5 space-y-3">
          {day.lessons.map((lesson, index) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              index={index}
              status={getLessonStatus(index)}
              links={links}
              onOpenLinkManager={onOpenLinkManager}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayCard;
