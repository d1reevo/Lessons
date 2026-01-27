import React, { useState, useEffect, useMemo } from 'react';
import { Clock } from 'lucide-react';
import { SCHEDULE, TIME_SLOTS } from '../constants';
import SubjectIcon from './SubjectIcon';

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const dashboardState = useMemo(() => {
    const now = currentTime;
    const dayOfWeek = now.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { 
        status: 'weekend' as const, 
        title: 'Вихідний! 🎉', 
        subtitle: 'Відпочивай!',
        countdown: '',
        progress: 100 
      };
    }

    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();
    const currentTotalMinutes = currentHours * 60 + currentMinutes;

    const schoolStart = 9 * 60;
    const schoolEnd = 15 * 60 + 25;

    if (currentTotalMinutes < schoolStart) {
      const minutesUntilStart = schoolStart - currentTotalMinutes;
      const hours = Math.floor(minutesUntilStart / 60);
      const mins = minutesUntilStart % 60;
      return { 
        status: 'morning' as const, 
        title: 'Доброго ранку! ☀️', 
        subtitle: hours > 0 ? `До початку: ${hours}г ${mins}хв` : `До початку: ${mins}хв`,
        countdown: '',
        progress: 0 
      };
    }

    if (currentTotalMinutes >= schoolEnd) {
      return { 
        status: 'over' as const, 
        title: 'Уроки закінчились! 🎉', 
        subtitle: 'Гарного відпочинку!',
        countdown: '',
        progress: 100 
      };
    }

    const totalSchoolMinutes = schoolEnd - schoolStart;
    const minutesPassed = currentTotalMinutes - schoolStart;
    const progress = Math.min(100, Math.max(0, (minutesPassed / totalSchoolMinutes) * 100));

    const todaySchedule = SCHEDULE[dayOfWeek - 1];
    if (!todaySchedule) {
      return { 
        status: 'over' as const, 
        title: 'Немає уроків', 
        subtitle: '',
        countdown: '',
        progress: 100 
      };
    }

    for (let i = 0; i < TIME_SLOTS.length && i < todaySchedule.lessons.length; i++) {
      const slot = TIME_SLOTS[i];
      const [startHour, startMin] = slot.start.split(':').map(Number);
      const [endHour, endMin] = slot.end.split(':').map(Number);
      
      const lessonStart = startHour * 60 + startMin;
      const lessonEnd = endHour * 60 + endMin;

      if (currentTotalMinutes >= lessonStart && currentTotalMinutes < lessonEnd) {
        const lesson = todaySchedule.lessons[i];
        const secondsRemaining = (lessonEnd - currentTotalMinutes) * 60 - currentSeconds;
        const minsRemaining = Math.floor(secondsRemaining / 60);
        const secsRemaining = secondsRemaining % 60;
        
        return {
          status: 'lesson' as const,
          title: lesson.subject,
          subtitle: `До кінця уроку: ${minsRemaining} хв ${secsRemaining} с`,
          countdown: `${minsRemaining}:${secsRemaining.toString().padStart(2, '0')}`,
          progress,
          currentSubject: lesson.subject,
        };
      }

      if (i > 0) {
        const prevSlot = TIME_SLOTS[i - 1];
        const [prevEndHour, prevEndMin] = prevSlot.end.split(':').map(Number);
        const breakStart = prevEndHour * 60 + prevEndMin;

        if (currentTotalMinutes >= breakStart && currentTotalMinutes < lessonStart) {
          const nextLesson = todaySchedule.lessons[i];
          const secondsRemaining = (lessonStart - currentTotalMinutes) * 60 - currentSeconds;
          const minsRemaining = Math.floor(secondsRemaining / 60);
          const secsRemaining = secondsRemaining % 60;

          return {
            status: 'break' as const,
            title: 'Перерва ☕',
            subtitle: `Наступний: ${nextLesson?.subject}`,
            countdown: `${minsRemaining}:${secsRemaining.toString().padStart(2, '0')}`,
            progress,
            nextSubject: nextLesson?.subject,
          };
        }
      }
    }

    return { 
      status: 'morning' as const, 
      title: 'Завантаження...', 
      subtitle: '',
      countdown: '',
      progress 
    };
  }, [currentTime]);

  const getGradient = () => {
    switch (dashboardState.status) {
      case 'morning': return 'from-orange-500 via-amber-500 to-yellow-500';
      case 'lesson': return 'from-indigo-600 via-purple-600 to-indigo-500';
      case 'break': return 'from-pink-500 via-rose-500 to-orange-500';
      case 'over':
      case 'weekend': return 'from-purple-600 via-violet-600 to-indigo-600';
      default: return 'from-indigo-600 via-purple-600 to-indigo-500';
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl p-5 bg-gradient-to-r ${getGradient()}`}>
      {/* Background blur */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
      
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
      
      <div className="relative z-10">
        {/* Title and Icon */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-white mb-0.5">{dashboardState.title}</h2>
            <p className="text-white/80">{dashboardState.subtitle}</p>
          </div>
          
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/20">
            {dashboardState.status === 'lesson' && dashboardState.currentSubject ? (
              <SubjectIcon subject={dashboardState.currentSubject} size={24} className="text-white drop-shadow" />
            ) : (
              <Clock size={24} className="text-white drop-shadow" />
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-white/70 mb-1.5 font-medium">
            <span>09:00</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">{Math.round(dashboardState.progress)}%</span>
            <span>15:25</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-white via-white/90 to-white rounded-full transition-all duration-1000 shadow-lg shadow-white/30"
              style={{ width: `${dashboardState.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
