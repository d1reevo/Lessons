import React, { useState, useEffect } from 'react';
import { X, Link2, Trash2, Check } from 'lucide-react';
import { LinkStorage } from '../types';
import { ALL_SUBJECTS } from '../constants';
import SubjectIcon from './SubjectIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: LinkStorage;
  onSaveLink: (subject: string, link: string) => void;
  onDeleteLink: (subject: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  links,
  onSaveLink,
  onDeleteLink,
}) => {
  const [editingSubject, setEditingSubject] = useState<string | null>(null);
  const [linkInput, setLinkInput] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setEditingSubject(null);
      setLinkInput('');
    }
  }, [isOpen]);

  const handleStartEdit = (subject: string) => {
    setEditingSubject(subject);
    setLinkInput(links[subject] || '');
  };

  const handleSave = (subject: string) => {
    if (linkInput.trim()) {
      onSaveLink(subject, linkInput.trim());
    } else {
      onDeleteLink(subject);
    }
    setEditingSubject(null);
    setLinkInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, subject: string) => {
    if (e.key === 'Enter') {
      handleSave(subject);
    } else if (e.key === 'Escape') {
      setEditingSubject(null);
      setLinkInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[80vh] bg-[#1a1a2e] rounded-3xl shadow-2xl border border-[#2a2a4a] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a4a]">
          <div>
            <h2 className="text-xl font-bold text-white">Налаштування</h2>
            <p className="text-sm text-gray-400">Додайте посилання для уроків</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#2a2a4a] text-gray-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {ALL_SUBJECTS.map((subject) => (
              <div
                key={subject}
                className="rounded-2xl bg-[#12121f] border border-[#2a2a4a] overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4">
                  {/* Icon */}
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#252545] text-indigo-400">
                    <SubjectIcon subject={subject} size={20} />
                  </div>

                  {/* Subject Name */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">{subject}</h4>
                    {links[subject] && editingSubject !== subject && (
                      <p className="text-xs text-green-400 truncate">{links[subject]}</p>
                    )}
                  </div>

                  {/* Actions */}
                  {editingSubject === subject ? (
                    <button
                      onClick={() => handleSave(subject)}
                      className="p-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                    >
                      <Check size={18} />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      {links[subject] && (
                        <button
                          onClick={() => onDeleteLink(subject)}
                          className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleStartEdit(subject)}
                        className={`p-2 rounded-xl transition-colors ${
                          links[subject]
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-[#252545] text-gray-400 hover:bg-[#2a2a4a]'
                        }`}
                      >
                        <Link2 size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Edit Input */}
                {editingSubject === subject && (
                  <div className="px-4 pb-4">
                    <input
                      type="url"
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, subject)}
                      placeholder="https://zoom.us/j/..."
                      autoFocus
                      className="w-full px-4 py-3 rounded-xl bg-[#0f0f1a] border border-[#2a2a4a] text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#2a2a4a]">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{Object.keys(links).length} з {ALL_SUBJECTS.length} посилань додано</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors"
            >
              Готово
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
