'use client';

import { useHistory } from '@/features/history/hooks/useHistory';
import HistoryHeader from '@/features/history/ui/HistoryHeader';
import HistoryList from '@/features/history/ui/HistoryList';
import HistorySummary from '@/features/history/ui/HistorySummary';
import { isLogin } from '@/shared/lib/isLogin';
import { useUserId } from '@/shared/stores';

export default function HistoryPage() {
  isLogin();

  const userId = useUserId();

  const { history, totalFocusHours, totalPomodoros, clearHistory } = useHistory(
    userId!
  );

  return (
    <div className='w-screen min-h-screen flex flex-col ml-80 mt-14'>
      <div className='w-full max-w-screen-lg px-4 py-0 flex flex-col'>
        {/* Header with navigation and clear history button */}
        <HistoryHeader onClearHistory={clearHistory} />

        {/* Page Title */}
        <h1 className='text-title1 mb-8 text-center'>Study Session History</h1>

        {/* Total Focus Hours */}
        <HistorySummary
          totalFocusHours={totalFocusHours}
          totalPomodoros={totalPomodoros}
        />

        {/* Task List */}
        <HistoryList history={history} />
      </div>
    </div>
  );
}
