import { create } from 'zustand';

interface AuthState {
  userId: string | null;
}

interface AuthActions {
  setUserId: (userId: string) => void;
  clearUserId: () => void;
  getUserId: () => string | null;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()((set, get) => ({
  userId:
    typeof window !== 'undefined' ? localStorage.getItem('user-id') : null,

  setUserId: (userId: string) => {
    set({ userId });
    if (typeof window !== 'undefined') {
      localStorage.setItem('user-id', userId);
    }
  },

  clearUserId: () => {
    set({ userId: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user-id');
    }
  },

  getUserId: () => {
    return get().userId;
  },
}));

export const useUserId = () => useAuthStore((state) => state.userId);
