"use client";
import { useHistory } from "@/features/history/hooks/useHistory";
import HistoryHeader from "@/features/history/ui/HistoryHeader";
import HistorySummary from "@/features/history/ui/HistorySummary";
import HistoryList from "@/features/history/ui/HistoryList";

export default function HistoryPage() {
  const { history, totalFocusHours, clearHistory } = useHistory();

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-components-fill">
      {/* Header with navigation and clear history button */}
      <HistoryHeader onClearHistory={clearHistory} />

      {/* Page Title */}
      <h1 className="text-title1 mb-8 text-center">Study Session History</h1>

      {/* Total Focus Hours */}
      <HistorySummary totalFocusHours={totalFocusHours} />

      {/* Task List */}
      <HistoryList history={history} />
    </div>
  );
}