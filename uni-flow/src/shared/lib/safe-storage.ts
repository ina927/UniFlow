export const getUserIdFromStorage = () =>
  typeof window !== 'undefined' ? localStorage.getItem('user-id') ?? '' : '';