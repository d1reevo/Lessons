// TypeScript interfaces for School Schedule Application

export interface TimeSlot {
  id: number;
  start: string;
  end: string;
}

export interface Lesson {
  id: string;
  subject: string;
  timeSlot: TimeSlot;
  dayIndex: number;
}

export interface DaySchedule {
  dayName: string;
  dayNameUk: string;
  dayIndex: number;
  lessons: Lesson[];
}

export interface SubjectLink {
  subject: string;
  url: string;
}

export interface LinkStorage {
  [subject: string]: string;
}

export type ViewMode = 'daily' | 'full';
export type Theme = 'light' | 'dark';
export type FullScheduleViewMode = 'timeline' | 'cards' | 'classic' | 'compact';

export interface DashboardState {
  status: 'morning' | 'lesson' | 'break' | 'over';
  currentSubject?: string;
  nextSubject?: string;
  countdown: string;
  progress: number;
}

export interface LessonStatus {
  isLive: boolean;
  isUpcoming: boolean;
  isPast: boolean;
}
