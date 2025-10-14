"use client";
import { useState, useEffect } from "react";
import { useHistory } from "@/features/history/hooks/useHistory";
import HistoryHeader from "@/features/history/ui/HistoryHeader";
import HistorySummary from "@/features/history/ui/HistorySummary";
import HistoryList from "@/features/history/ui/HistoryList";

export default function HistoryPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/me", {
          credentials: "include",
          cache: "no-store",
        });
        if (res.status === 401) {
          setUserId(null);
          return;
        }
        const data = await res.json();
        setUserId(data.user?.id || null);
      } catch (err) {
        setUserId(null);
      }
    };
    fetchUser();
  }, []);

  const { history, totalFocusHours, totalPomodoros, clearHistory } = useHistory(userId ?? "");

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center bg-components-fill">
      <div className="w-full max-w-screen-lg mx-auto px-4 py-8 flex flex-col items-center">
        {/* Header with navigation and clear history button */}
        <HistoryHeader onClearHistory={clearHistory} />

        {/* Page Title */}
        <h1 className="text-title1 mb-8 text-center">Study Session History</h1>

        {/* Total Focus Hours */}
        <HistorySummary totalFocusHours={totalFocusHours} totalPomodoros={totalPomodoros} />

        {/* Task List */}
        <HistoryList history={history} />
      </div>
    </div>
  );
}