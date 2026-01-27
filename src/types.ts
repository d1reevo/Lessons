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
  dayShort: string;
  dayIndex: number;
  lessons: Lesson[];
}

export interface LinkStorage {
  [subject: string]: string;
}

export type ViewMode = 'daily' | 'full';
export type ScheduleViewMode = 'list' | 'compact' | 'table';

export interface LessonStatus {
  isLive: boolean;
  isUpcoming: boolean;
  isPast: boolean;
}
