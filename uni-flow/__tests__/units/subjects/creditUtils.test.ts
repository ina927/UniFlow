import { describe, it, expect } from 'vitest';
import {
  calculateTotalCredits,
  calculateProgress,
  getTermCredits,
  formatCreditDisplay,
} from '@/widgets/academics/lib/creditUtils';
import { SubjectRow } from '@/features/academics/types';

describe('creditUtils', () => {
  const now = new Date();
  const mockTerm1 = { 
    id: 'term1', 
    title: 'Term 1',
    academicYear: 2023,
    startDate: now,
    endDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30 * 3), // 3 months later
    createdAt: now,
    updatedAt: now,
    version: 1,
    academicCourseId: 'course1'
  };

  const mockTerm2 = { 
    ...mockTerm1, 
    id: 'term2', 
    title: 'Term 2' 
  };

  const mockTerm3 = { 
    ...mockTerm1, 
    id: 'term3', 
    title: 'Term 3' 
  };

  const mockSubjects: SubjectRow[] = [
    {
      id: '1',
      title: 'Subject 1',
      code: 'SUBJ1',
      credits: 3,
      term: mockTerm1,
    },
    {
      id: '2',
      title: 'Subject 2',
      code: 'SUBJ2',
      credits: 4,
      term: mockTerm1,
    },
    {
      id: '3',
      title: 'Subject 3',
      code: 'SUBJ3',
      credits: 3,
      term: mockTerm2,
    },
    {
      id: '4',
      title: 'Subject 4',
      code: 'SUBJ4',
      credits: 2,
      term: mockTerm3,
    }
  ] as SubjectRow[];

  describe('calculateTotalCredits', () => {
    it('should return 0 for empty array', () => {
      expect(calculateTotalCredits([])).toBe(0);
    });

    it('should sum up all credits', () => {
      expect(calculateTotalCredits(mockSubjects)).toBe(12);
    });
  });

  describe('calculateProgress', () => {
    it('should return 0 when total is 0', () => {
      expect(calculateProgress(10, 0)).toBe(0);
    });

    it('should calculate correct progress percentage', () => {
      expect(calculateProgress(30, 100)).toBe(30);
      expect(calculateProgress(1, 3)).toBe(33);
      expect(calculateProgress(2, 3)).toBe(67);
    });
  });

  describe('getTermCredits', () => {
    it('should return 0 when no subjects for term', () => {
      expect(getTermCredits(mockSubjects, 'non-existent-term')).toBe(0);
    });

    it('should return sum of credits for specific term', () => {
      expect(getTermCredits(mockSubjects, 'term1')).toBe(7);
      expect(getTermCredits(mockSubjects, 'term2')).toBe(3);
    });
  });

  describe('formatCreditDisplay', () => {
    it('should format credit display correctly', () => {
      expect(formatCreditDisplay(30, 100)).toBe('30 / 100 (30%)');
      expect(formatCreditDisplay(0, 100)).toBe('0 / 100 (0%)');
      expect(formatCreditDisplay(50, 0)).toBe('50 / 0 (0%)');
    });
  });
});
