// store/useStore.ts
import { create } from 'zustand';

import { AcademicCourseEntity, SubjectEntity, TermEntity } from '@/entities';

interface AcademicStoreState {
  academicCourse: AcademicCourseEntity | null;
  setAcademicCourse: (academicCourse: AcademicCourseEntity) => void;

  term: TermEntity | null;
  setTerm: (term: TermEntity) => void;
  resetTerm: () => void;
  
  subjects: SubjectEntity[];
  setSubjects: (subjects: SubjectEntity[]) => void;
  resetSubjects: () => void;

  subject: SubjectEntity | null;
  setSubject: (subject: SubjectEntity) => void;
  resetSubject: () => void;
}

export const useAcademicStore = create<AcademicStoreState>((set) => ({
  academicCourse: null,
  setAcademicCourse: (academicCourse: AcademicCourseEntity) => set({ academicCourse }),

  term: null,
  setTerm: (term: TermEntity) => set({ term }),
  resetTerm: () => set({ term: null }),

  subjects: [],
  setSubjects: (subjects: SubjectEntity[]) => set({ subjects }),
  resetSubjects: () => set({ subjects: [] }),

  subject: null,
  setSubject: (subject: SubjectEntity) => set({ subject }),
  resetSubject: () => set({ subject: null }),
}));
