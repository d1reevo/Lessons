import { TimeSlot, DaySchedule, Lesson } from './types';

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

const SCHEDULE_DATA: { [key: string]: string[] } = {
  Monday: [
    'Англійська мова',
    'Інформатика (група I)',
    'Математика',
    'Історія',
    'Історія',
    'Хімія',
    'Хімія',
  ],
  Tuesday: [
    'Англійська мова',
    'Французька мова',
    'Французька мова',
    'Математика',
    'Технології',
    'Англійська мова',
    'Математика',
    'Навчаємось разом',
  ],
  Wednesday: [
    'Українська мова',
    'Українська мова',
    'Фізика',
    'Фізична культура',
    'Фізична культура',
    'Математика',
    'Українська мова',
  ],
  Thursday: [
    'Географія',
    'Правознавство',
    'Математика',
    'Зарубіжна література',
    'Історія (група I)',
    'Інформатика',
    'Фізична культура',
  ],
  Friday: [
    'Українська мова',
    'Математика',
    'Біологія',
    'Біологія',
    'Фізика',
    'Фізика',
    'Українська мова',
  ],
};

export const DAY_INFO: { [key: string]: { uk: string; short: string } } = {
  Monday: { uk: 'Понеділок', short: 'Пн' },
  Tuesday: { uk: 'Вівторок', short: 'Вт' },
  Wednesday: { uk: 'Середа', short: 'Ср' },
  Thursday: { uk: 'Четвер', short: 'Чт' },
  Friday: { uk: "П'ятниця", short: 'Пт' },
};

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
      dayNameUk: DAY_INFO[day].uk,
      dayShort: DAY_INFO[day].short,
      dayIndex,
      lessons,
    };
  });
};

export const SCHEDULE: DaySchedule[] = generateSchedule();

// All unique subjects for settings (16 subjects)
export const ALL_SUBJECTS: string[] = [
  'Французька мова',
  'Англійська мова',
  'Зарубіжна література',
  'Українська мова',
  'Українська література',
  'Географія',
  'Фізика',
  'Історія',
  'Фізична культура',
  'Математика',
  'Технології',
  'Хімія',
  'Навчаємось разом',
  'Біологія',
  'Інформатика',
  'Мистецтво',
  'Правознавство',
  'Інформатика (група I)',
  'Історія (група I)',
];

export const STORAGE_KEYS = {
  theme: 'school-schedule-theme',
  links: 'school-schedule-links',
  viewMode: 'school-schedule-view-mode',
  scheduleViewMode: 'school-schedule-schedule-view-mode',
  schedule: 'school-schedule-data',
};
