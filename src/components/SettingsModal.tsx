import React, { useEffect, useState } from 'react';
import { X, Link2, Trash2, Check, Pencil, Plus, RotateCcw } from 'lucide-react';
import { DaySchedule, LinkStorage } from '../types';
import { ALL_SUBJECTS, SCHEDULE, TIME_SLOTS } from '../constants';
import SubjectIcon from './SubjectIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: LinkStorage;
  schedule: DaySchedule[];
  onSaveLink: (subject: string, link: string) => void;
  onDeleteLink: (subject: string) => void;
  onSaveSchedule: (schedule: DaySchedule[]) => void;
}

type SettingsTab = 'links' | 'schedule';

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  links,
  schedule,
  onSaveLink,
  onDeleteLink,
  onSaveSchedule,
}) => {
  const [editingSubject, setEditingSubject] = useState<string | null>(null);
  const [linkInput, setLinkInput] = useState('');
  const [activeTab, setActiveTab] = useState<SettingsTab>('schedule');
  const [draftSchedule, setDraftSchedule] = useState(schedule);

  useEffect(() => {
    if (isOpen) setDraftSchedule(schedule);
    else {
      setEditingSubject(null);
      setLinkInput('');
    }
  }, [isOpen, schedule]);

  const handleStartEdit = (subject: string) => {
    setEditingSubject(subject);
    setLinkInput(links[subject] || '');
  };

  const handleSave = (subject: string) => {
    if (linkInput.trim()) onSaveLink(subject, linkInput.trim());
    else onDeleteLink(subject);
    setEditingSubject(null);
    setLinkInput('');
  };

  const handleKeyDown = (event: React.KeyboardEvent, subject: string) => {
    if (event.key === 'Enter') handleSave(subject);
    else if (event.key === 'Escape') {
      setEditingSubject(null);
      setLinkInput('');
    }
  };

  const updateSubject = (dayIndex: number, lessonIndex: number, subject: string) => {
    setDraftSchedule((current) => current.map((day, index) => index === dayIndex
      ? { ...day, lessons: day.lessons.map((lesson, indexInDay) => indexInDay === lessonIndex ? { ...lesson, subject } : lesson) }
      : day));
  };

  const addLesson = (dayIndex: number) => {
    setDraftSchedule((current) => current.map((day, index) => {
      if (index !== dayIndex || day.lessons.length >= TIME_SLOTS.length) return day;
      const lessonIndex = day.lessons.length;
      return {
        ...day,
        lessons: [...day.lessons, {
          id: `${day.dayName}-${lessonIndex + 1}`,
          subject: 'Новий урок',
          timeSlot: TIME_SLOTS[lessonIndex],
          dayIndex: day.dayIndex,
        }],
      };
    }));
  };

  const removeLesson = (dayIndex: number, lessonIndex: number) => {
    setDraftSchedule((current) => current.map((day, index) => {
      if (index !== dayIndex) return day;
      return {
        ...day,
        lessons: day.lessons
          .filter((_, indexInDay) => indexInDay !== lessonIndex)
          .map((lesson, nextIndex) => ({
            ...lesson,
            id: `${day.dayName}-${nextIndex + 1}`,
            timeSlot: TIME_SLOTS[nextIndex],
            dayIndex: day.dayIndex,
          })),
      };
    }));
  };

  const saveSchedule = () => {
    onSaveSchedule(draftSchedule);
    onClose();
  };

  const restoreSchedule = () => setDraftSchedule(SCHEDULE);

  if (!isOpen) return null;

  const subjects = Array.from(new Set([
    ...ALL_SUBJECTS,
    ...schedule.flatMap((day) => day.lessons.map((lesson) => lesson.subject)),
  ]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl max-h-[88vh] bg-[#1a1a2e] rounded-3xl shadow-2xl border border-[#2a2a4a] flex flex-col">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#2a2a4a]">
          <div>
            <h2 className="text-xl font-bold text-white">Налаштування</h2>
            <p className="text-sm text-gray-400">Розклад 8-Б · група I</p>
          </div>
          <button aria-label="Закрити налаштування" onClick={onClose} className="p-2 rounded-xl hover:bg-[#2a2a4a] text-gray-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-2 px-4 pt-4">
          <button onClick={() => setActiveTab('schedule')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'schedule' ? 'bg-indigo-500 text-white' : 'bg-[#12121f] text-gray-400 hover:text-white'}`}>
            <Pencil size={16} /> Розклад уроків
          </button>
          <button onClick={() => setActiveTab('links')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'links' ? 'bg-indigo-500 text-white' : 'bg-[#12121f] text-gray-400 hover:text-white'}`}>
            <Link2 size={16} /> Посилання
          </button>
        </div>

        {activeTab === 'schedule' ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <p className="px-1 text-sm text-gray-400">Змініть назву предмета, додайте або видаліть урок. Час наступних уроків оновиться автоматично.</p>
              {draftSchedule.map((day, dayIndex) => (
                <section key={day.dayName} className="rounded-2xl bg-[#12121f] border border-[#2a2a4a] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-white">{day.dayNameUk}</h3>
                    <span className="text-xs text-gray-500">{day.lessons.length} з {TIME_SLOTS.length} уроків</span>
                  </div>
                  <div className="space-y-2">
                    {day.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="flex items-center gap-2">
                        <span className="w-8 shrink-0 text-center text-xs font-semibold text-gray-500">{lessonIndex + 1}</span>
                        <span className="hidden sm:grid w-9 h-9 shrink-0 place-items-center rounded-lg bg-[#252545] text-indigo-400">
                          <SubjectIcon subject={lesson.subject} size={17} />
                        </span>
                        <input
                          aria-label={`${day.dayNameUk}, урок ${lessonIndex + 1}`}
                          value={lesson.subject}
                          onChange={(event) => updateSubject(dayIndex, lessonIndex, event.target.value)}
                          className="min-w-0 flex-1 rounded-xl bg-[#0a0a12] border border-[#2a2a4a] px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                        />
                        <span className="hidden md:block w-[105px] text-right text-xs text-gray-500">{TIME_SLOTS[lessonIndex]?.start}–{TIME_SLOTS[lessonIndex]?.end}</span>
                        <button aria-label={`Видалити урок ${lessonIndex + 1}, ${day.dayNameUk}`} title="Видалити урок" onClick={() => removeLesson(dayIndex, lessonIndex)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 size={17} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {day.lessons.length < TIME_SLOTS.length && (
                    <button onClick={() => addLesson(dayIndex)} className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-500/40 py-2.5 text-sm text-indigo-300 hover:bg-indigo-500/10 transition-colors">
                      <Plus size={16} /> Додати урок
                    </button>
                  )}
                </section>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-[#2a2a4a]">
              <button onClick={restoreSchedule} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                <RotateCcw size={15} /> Початковий розклад
              </button>
              <button onClick={saveSchedule} className="flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 transition-colors">
                <Check size={17} /> Зберегти розклад
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {subjects.map((subject) => (
                  <div key={subject} className="rounded-2xl bg-[#12121f] border border-[#2a2a4a] overflow-hidden">
                    <div className="flex items-center gap-3 p-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#252545] text-indigo-400"><SubjectIcon subject={subject} size={20} /></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{subject}</h4>
                        {links[subject] && editingSubject !== subject && <p className="text-xs text-green-400 truncate">{links[subject]}</p>}
                      </div>
                      {editingSubject === subject ? (
                        <button aria-label="Зберегти посилання" onClick={() => handleSave(subject)} className="p-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"><Check size={18} /></button>
                      ) : (
                        <div className="flex items-center gap-2">
                          {links[subject] && <button aria-label="Видалити посилання" onClick={() => onDeleteLink(subject)} className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"><Trash2 size={16} /></button>}
                          <button aria-label={`Додати або змінити посилання: ${subject}`} onClick={() => handleStartEdit(subject)} className={`p-2 rounded-xl transition-colors ${links[subject] ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-[#252545] text-gray-400 hover:bg-[#2a2a4a]'}`}><Link2 size={18} /></button>
                        </div>
                      )}
                    </div>
                    {editingSubject === subject && <div className="px-4 pb-4"><input type="url" value={linkInput} onChange={(event) => setLinkInput(event.target.value)} onKeyDown={(event) => handleKeyDown(event, subject)} placeholder="https://zoom.us/j/..." autoFocus className="w-full px-4 py-3 rounded-xl bg-[#0f0f1a] border border-[#2a2a4a] text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors" /></div>}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-[#2a2a4a]">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{Object.keys(links).length} посилань додано</span>
                <button onClick={onClose} className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors">Готово</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
