import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AcademicState {
  selectedTermId: string | null;
}

interface AcademicActions {
  setSelectedTermId: (termId: string | null) => void;
  clearSelectedTerm: () => void;
}

type AcademicStore = AcademicState & AcademicActions;

export const useAcademicStore = create<AcademicStore>()(
  persist(
    (set) => ({
      selectedTermId: null,

      setSelectedTermId: (termId: string | null) => {
        set({ selectedTermId: termId });
      },

      clearSelectedTerm: () => {
        set({ selectedTermId: null });
      },
    }),
    {
      name: 'academic-storage',
      partialize: (state) => ({
        selectedTermId: state.selectedTermId,
      }),
    }
  )
);

export const useSelectedTermId = () => useAcademicStore((state) => state.selectedTermId);
