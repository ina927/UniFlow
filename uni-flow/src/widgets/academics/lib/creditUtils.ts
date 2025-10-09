import { SubjectRow } from '@/features/academics/types';

export const calculateTotalCredits = (subjects: SubjectRow[]): number => {
  return subjects.reduce((sum, subject) => sum + (subject.credits || 0), 0);
};

export const calculateProgress = (current: number, total: number): number => {
  return total > 0 ? Math.round((current / total) * 100) : 0;
};

export const getTermCredits = (subjects: SubjectRow[], termId: string): number => {
  const termSubjects = subjects.filter(subject => subject.term?.id === termId);
  return calculateTotalCredits(termSubjects);
};

export const formatCreditDisplay = (current: number, total: number): string => {
  return `${current} / ${total} (${calculateProgress(current, total)}%)`;
};
