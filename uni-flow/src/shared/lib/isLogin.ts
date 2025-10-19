import { redirect } from 'next/navigation';

export const isLogin = () => {
  if (typeof window !== 'undefined') {
    const userId = localStorage.getItem('user-id');

    if (!userId) {
      redirect('/');
    }
  }
};
