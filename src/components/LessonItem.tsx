import React, { useState } from 'react';
import { Clock, ExternalLink, ChevronDown, Edit3 } from 'lucide-react';
import { Lesson, LessonStatus, LinkStorage } from '../types';
import SubjectIcon from './SubjectIcon';

interface LessonItemProps {
  lesson: Lesson;
  index: number;
  status: LessonStatus;
  links: LinkStorage;
  onOpenLinkManager: (subject: string) => void;
}

const LessonItem: React.FC<LessonItemProps> = ({
  lesson,
  index,
  status,
  links,
  onOpenLinkManager,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasLink = links[lesson.subject];

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLink) {
      window.open(hasLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenLinkManager(lesson.subject);
  };

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`
        rounded-2xl overflow-hidden border
        transition-all duration-300
        ${status.isLive 
          ? 'glass border-indigo-500/50' 
          : 'glass border-[#2d2d4a]/50'
        }
      `}
    >
      {/* Main Row */}
      <div
        onClick={handleCardClick}
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.03] transition-all duration-300"
      >
        {/* Lesson Number */}
        <div
          className={`
            w-10 h-10 flex items-center justify-center rounded-xl font-semibold text-base
            transition-all duration-300
            ${status.isLive 
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30' 
              : 'glass-light text-gray-400'
            }
          `}
        >
          {index + 1}
        </div>

        {/* Subject Icon */}
        <div
          className={`
            w-10 h-10 flex items-center justify-center rounded-xl
            transition-all duration-200
            ${status.isLive 
              ? 'bg-indigo-500/20 text-indigo-400' 
              : 'glass-light text-indigo-400'
            }
          `}
        >
          <SubjectIcon subject={lesson.subject} size={20} />
        </div>

        {/* Subject Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">
            {lesson.subject}
          </h4>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Clock size={12} />
              {lesson.timeSlot.start} - {lesson.timeSlot.end}
            </p>
            {status.isLive && (
              <span className="flex items-center gap-1 text-xs text-green-400">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Онлайн
              </span>
            )}
          </div>
        </div>

        {/* Expand Indicator */}
        <ChevronDown 
          size={20} 
          className={`text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Expanded Content */}
      <div
        className={`
          overflow-hidden transition-all duration-500 ease-out
          ${isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-4 pb-4">
          <div className="rounded-xl glass-light border border-white/5 p-4 space-y-3">
            {hasLink ? (
              <>
                {/* Join Button */}
                <button
                  onClick={handleJoinClick}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold 
                    bg-gradient-to-r from-indigo-500 to-purple-600 text-white
                    hover:shadow-lg hover:shadow-indigo-500/20
                    active:scale-[0.98] transition-all duration-200"
                >
                  <ExternalLink size={18} />
                  <span>Приєднатися до уроку</span>
                </button>
                
                {/* Edit Link */}
                <button
                  onClick={handleEditClick}
                  className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors py-1"
                >
                  <Edit3 size={14} />
                  <span>Змінити посилання</span>
                </button>
              </>
            ) : (
              <>
                {/* No Link Message */}
                <p className="text-center text-gray-500 text-sm py-2">
                  Посилання ще не додано
                </p>
                
                {/* Add Link Button */}
                <button
                  onClick={handleEditClick}
                  className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors py-1"
                >
                  <Edit3 size={14} />
                  <span>Додати посилання</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonItem;
