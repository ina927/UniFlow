'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/stores';
import { useAcademicStore } from '@/shared/stores';

export function useLogout() {
  const router = useRouter();
  const { setUserId } = useAuthStore();
  const { clear } = useAcademicStore();

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setUserId('');
      clear();
      router.push('/');
    }
  };

  return { logout };
}
