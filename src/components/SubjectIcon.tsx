import React from 'react';
import {
  Languages,
  BookOpen,
  PenTool,
  Globe,
  Atom,
  Landmark,
  Dumbbell,
  Calculator,
  Wrench,
  FlaskConical,
  Users,
  Leaf,
  Monitor,
  Palette,
  BookMarked,
} from 'lucide-react';

interface SubjectIconProps {
  subject: string;
  size?: number;
  className?: string;
}

const SubjectIcon: React.FC<SubjectIconProps> = ({ 
  subject, 
  size = 20, 
  className = '' 
}) => {
  const subjectLower = subject.toLowerCase();

  if (subjectLower.includes('французька') || subjectLower.includes('англійська')) {
    return <Languages size={size} className={className} />;
  }
  if (subjectLower.includes('література')) {
    return <BookOpen size={size} className={className} />;
  }
  if (subjectLower.includes('українська мова')) {
    return <PenTool size={size} className={className} />;
  }
  if (subjectLower.includes('географія')) {
    return <Globe size={size} className={className} />;
  }
  if (subjectLower.includes('фізика')) {
    return <Atom size={size} className={className} />;
  }
  if (subjectLower.includes('історія')) {
    return <Landmark size={size} className={className} />;
  }
  if (subjectLower.includes('фізична культура')) {
    return <Dumbbell size={size} className={className} />;
  }
  if (subjectLower.includes('математика')) {
    return <Calculator size={size} className={className} />;
  }
  if (subjectLower.includes('технолог')) {
    return <Wrench size={size} className={className} />;
  }
  if (subjectLower.includes('хімія')) {
    return <FlaskConical size={size} className={className} />;
  }
  if (subjectLower.includes('навчаємось разом')) {
    return <Users size={size} className={className} />;
  }
  if (subjectLower.includes('біологія')) {
    return <Leaf size={size} className={className} />;
  }
  if (subjectLower.includes('інформатика')) {
    return <Monitor size={size} className={className} />;
  }
  if (subjectLower.includes('мистецтво')) {
    return <Palette size={size} className={className} />;
  }

  return <BookMarked size={size} className={className} />;
};

export default SubjectIcon;
