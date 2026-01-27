// Constants and hardcoded schedule data for School Schedule Application

import { TimeSlot, DaySchedule, Lesson } from './types';

// Time ranges for each lesson period
export const TIME_SLOTS: TimeSlot[] = [
  { id: 1, start: '09:00', end: '09:35' },
  { id: 2, start: '09:50', end: '10:25' },
  { id: 3, start: '10:40', end: '11:15' },
  { id: 4, start: '11:30', end: '12:05' },
  { id: 5, start: '12:20', end: '12:55' },
  { id: 6, start: '13:10', end: '13:45' },
  { id: 7, start: '14:00', end: '14:35' },
  { id: 8, start: '14:50', end: '15:25' },
];

// Raw schedule data by day
const SCHEDULE_DATA: { [key: string]: string[] } = {
  Monday: [
    'Французька мова',
    'Французька мова',
    'Зарубіжна література',
    'Англійська мова',
    'Географія',
    'Українська мова',
    'Українська література',
  ],
  Tuesday: [
    'Фізика',
    'Історія',
    'Фізична культура',
    'Фізична культура',
    'Фізика',
    'Математика',
    'Історія',
  ],
  Wednesday: [
    'Українська література',
    'Технології',
    'Українська мова (м)',
    'Математика',
    'Математика',
    'Хімія',
    'Хімія',
  ],
  Thursday: [
    'Математика',
    'Навчаємось разом',
    'Англійська мова',
    'Англійська мова',
    'Фізична культура',
    'Математика',
    'Біологія',
  ],
  Friday: [
    'Математика',
    'Географія',
    'Зарубіжна література',
    'Інформатика',
    'Мистецтво',
    'Біологія',
    'Історія',
  ],
};

// Ukrainian day names
export const DAY_NAMES_UK: { [key: string]: string } = {
  Monday: 'Понеділок',
  Tuesday: 'Вівторок',
  Wednesday: 'Середа',
  Thursday: 'Четвер',
  Friday: "П'ятниця",
};

// Generate full schedule with all lesson details
export const generateSchedule = (): DaySchedule[] => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  return days.map((day, dayIndex) => {
    const subjects = SCHEDULE_DATA[day];
    const lessons: Lesson[] = subjects.map((subject, lessonIndex) => ({
      id: `${day}-${lessonIndex + 1}`,
      subject,
      timeSlot: TIME_SLOTS[lessonIndex],
      dayIndex,
    }));

    return {
      dayName: day,
      dayNameUk: DAY_NAMES_UK[day],
      dayIndex,
      lessons,
    };
  });
};

export const SCHEDULE: DaySchedule[] = generateSchedule();

// App configuration
export const APP_CONFIG = {
  groupName: '8-Б',
  groupNumber: 'Група II',
  schoolDayStart: '09:00',
  schoolDayEnd: '15:25',
};

// Subject to icon mapping keywords
export const SUBJECT_ICONS: { [key: string]: string } = {
  'Французька мова': 'languages',
  'Англійська мова': 'languages',
  'Зарубіжна література': 'book-open',
  'Українська література': 'book-open',
  'Українська мова': 'pen-tool',
  'Українська мова (м)': 'pen-tool',
  'Географія': 'globe',
  'Фізика': 'atom',
  'Історія': 'landmark',
  'Фізична культура': 'dumbbell',
  'Математика': 'calculator',
  'Технології': 'wrench',
  'Хімія': 'flask-conical',
  'Навчаємось разом': 'users',
  'Біологія': 'leaf',
  'Інформатика': 'monitor',
  'Мистецтво': 'palette',
};

// Gradient configurations for dashboard
export const GRADIENTS = {
  morning: 'from-orange-400 via-amber-500 to-yellow-500',
  lesson: 'from-blue-500 via-indigo-500 to-purple-500',
  break: 'from-pink-500 via-rose-500 to-red-400',
  over: 'from-purple-600 via-violet-600 to-indigo-600',
};

// Local storage keys
export const STORAGE_KEYS = {
  theme: 'school-schedule-theme',
  links: 'school-schedule-links',
  viewMode: 'school-schedule-view-mode',
  fullScheduleViewMode: 'school-schedule-full-view-mode',
};
