import { useEffect, useState } from 'react';

import { useMemo } from 'react';

type Session = {
  id: string;
  subject?: string;
  taskTitle?: string;
  taskStatus?: string;
  duration: number;
  startTime: string;
  endTime: string;
};

export const useHistory = (userId: string) => {
  const [history, setHistory] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimerSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/timer-sessions?userId=${userId}`);
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || 'Failed to fetch timer sessions');

      const sessions = data.timerSessions.map((session: any) => ({
        id: session.id,
        subject: session.todo?.subject?.title || 'Other',
        taskTitle: session.todo?.title || 'Study Session',
        taskStatus: session.todo?.status || 'UNKNOWN',
        duration:
          session.startTime && session.endTime
            ? (new Date(session.endTime).getTime() -
                new Date(session.startTime).getTime()) /
              1000
            : 0,
        startTime: session.startTime,
        endTime: session.endTime,
      }));

      setHistory(sessions);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimerSessions();
  }, [userId]);

  const totalFocusHours = useMemo(
    () => history.reduce((acc, s) => acc + s.duration, 0) / 3600,
    [history]
  );

  const totalPomodoros = useMemo(() => history.length, [history]);

  const clearHistory = async () => {
    try {
      const response = await fetch('/api/timer-sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Failed to clear history');
      setHistory([]);
      alert('History cleared successfully!');
    } catch (error) {
      console.error('Error clearing history:', error as string);
      alert('Failed to clear history. Please try again.');
    }
  };

  return {
    history,
    totalFocusHours,
    totalPomodoros,
    clearHistory,
    fetchTimerSessions,
    loading,
    error,
  };
};
