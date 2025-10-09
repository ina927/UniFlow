import { TermEntity } from '@/entities';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AcademicState {
  academicCourseId: string | null;
  terms: TermEntity[];
  selectedTermId: string | null;
}

interface AcademicActions {
  setAcademicCourseId: (academicCourseId: string | null) => void;
  setTerms: (terms: TermEntity[]) => void;
  setSelectedTermId: (termId: string | null) => void;
  clearSelectedTerm: () => void;
}

type AcademicStore = AcademicState & AcademicActions;

export const useAcademicStore = create<AcademicStore>()(
  persist(
    (set) => ({
      academicCourseId: null,
      terms: [],
      selectedTermId: null,

      setAcademicCourseId: (academicCourseId: string | null) => {
        set({ academicCourseId });
      },

      setTerms: (terms: TermEntity[]) => {
        set({ terms });
      },
      
      setSelectedTermId: (termId: string | null) => {
        set({ 
          selectedTermId: termId === "all" ? null : termId 
        });
      },

      clearSelectedTerm: () => {
        set({ selectedTermId: null });
      },
    }),
    {
      name: 'academic-storage',
      partialize: (state) => ({
        academicCourseId: state.academicCourseId,
        terms: state.terms,
        selectedTermId: state.selectedTermId,
      }),
    }
  )
);

export const useAcademicCourseId = () => useAcademicStore((state) => state.academicCourseId);
export const useTerms = () => useAcademicStore((state) => state.terms);
export const useSelectedTermId = () => useAcademicStore((state) => state.selectedTermId);
