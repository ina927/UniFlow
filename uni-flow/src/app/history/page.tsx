'use client';

import { useHistory } from '@/features/history/hooks/useHistory';
import HistoryHeader from '@/features/history/ui/HistoryHeader';
import HistoryList from '@/features/history/ui/HistoryList';
import HistorySummary from '@/features/history/ui/HistorySummary';
import { useUserId } from '@/shared/stores';

export default function HistoryPage() {
  const userId = useUserId();

  const { history, totalFocusHours, totalPomodoros, clearHistory } = useHistory(
    userId!
  );

  return (
    <div className='w-screen min-h-screen flex flex-col items-center justify-center bg-components-fill'>
      <div className='w-full max-w-screen-lg mx-auto px-4 py-8 flex flex-col items-center'>
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
