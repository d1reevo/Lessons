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
    'Французька мова',
    'Французька мова',
    'Зарубіжна література',
    'Англійська мова',
    'Географія',
    'Українська мова',
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
];

export const STORAGE_KEYS = {
  theme: 'school-schedule-theme',
  links: 'school-schedule-links',
  viewMode: 'school-schedule-view-mode',
  scheduleViewMode: 'school-schedule-schedule-view-mode',
};
