import React, { useState, useEffect } from 'react';
import { X, Link2, Trash2, Save, ExternalLink } from 'lucide-react';
import SubjectIcon from './SubjectIcon';

interface LinkManagerProps {
  isOpen: boolean;
  subject: string;
  currentLink: string;
  onClose: () => void;
  onSave: (subject: string, link: string) => void;
  onDelete: (subject: string) => void;
}

const LinkManager: React.FC<LinkManagerProps> = ({
  isOpen,
  subject,
  currentLink,
  onClose,
  onSave,
  onDelete,
}) => {
  const [link, setLink] = useState(currentLink);
  const [error, setError] = useState('');

  useEffect(() => {
    setLink(currentLink);
    setError('');
  }, [currentLink, isOpen]);

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = () => {
    if (!validateUrl(link)) {
      setError('Введіть коректне посилання');
      return;
    }
    onSave(subject, link.trim());
    onClose();
  };

  const handleDelete = () => {
    onDelete(subject);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    else if (e.key === 'Escape') onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md glass rounded-3xl p-6 shadow-2xl border border-white/10 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300 hover:rotate-90"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 animate-float">
            <SubjectIcon subject={subject} size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Посилання</h3>
            <p className="text-sm text-gray-400">{subject}</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Посилання на урок (Zoom, Meet, тощо)
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Link2 size={18} className="text-gray-500" />
            </div>
            <input
              type="url"
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="https://zoom.us/j/..."
              className={`
                w-full pl-12 pr-4 py-3 rounded-2xl border transition-all duration-300
                glass-light border-white/10 text-white placeholder-gray-500
                focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20
                hover:border-white/20
                ${error ? 'border-red-500/50 focus:ring-red-500/20' : ''}
              `}
            />
          </div>
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>

        {currentLink && (
          <div className="mb-4 p-3 rounded-xl glass-light border border-white/5">
            <p className="text-xs font-medium mb-1 text-gray-500">Поточне посилання:</p>
            <a
              href={currentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm truncate"
            >
              <ExternalLink size={14} />
              <span className="truncate">{currentLink}</span>
            </a>
          </div>
        )}

        <div className="flex gap-3">
          {currentLink && (
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-medium 
                transition-all duration-300 bg-red-500/20 text-red-400 
                hover:bg-red-500/30 hover:scale-105 active:scale-95 border border-red-500/20"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button
            onClick={handleSave}
            className="relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-semibold text-white 
              transition-all duration-300 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient
              hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
          >
            <span className="absolute inset-0 animate-shimmer" />
            <Save size={18} className="relative z-10" />
            <span className="relative z-10">Зберегти</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkManager;
