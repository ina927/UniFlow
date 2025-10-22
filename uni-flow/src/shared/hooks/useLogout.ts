'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/stores';
import { useAcademicStore } from '@/shared/stores';

export function useLogout() {
  const router = useRouter();
  const { setUserId, ...authApi } = useAuthStore();
  const { clear: clearAcademic } = useAcademicStore();

  const logout = async (askConfirm: boolean = true) => {
    if (askConfirm) {
      const ok = typeof window !== 'undefined'
        ? window.confirm('Are you sure you want to log out?')
        : true;
      if (!ok) return;
    }
    try {
      await fetch('/api/auth/logout', { method: 'POST', cache: 'no-store' });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setUserId('');
      clearAcademic?.(); 
      router.replace('/');
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          if (window.location.pathname !== '/') {
            window.location.assign('/');
          }
        }, 60);
      }
    }
  };

  return { logout };
}
