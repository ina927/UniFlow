import { useEffect, useState } from "react";

type Session = {
  id: string;
  subject?: string;
  taskTitle?: string;
  taskStatus?: string;
  duration: number;
  startTime: string;
  endTime: string;
};

export const useHistory = () => {
  const [history, setHistory] = useState<Session[]>([]);

  useEffect(() => {
    const fetchTimerSessions = async () => {
      try {
        const userId = "83482f49-8367-48d1-93f0-e98f01010f0f"; // Replace with actual user ID
        const response = await fetch(`/api/timer-sessions?userId=${userId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch timer sessions");
        }

        const sessions = data.timerSessions.map((session: any) => ({
          id: session.id,
          subject: session.todo?.subject?.title || "Other",
          taskTitle: session.todo?.title || "Unnamed Task",
          taskStatus: session.todo?.status || "UNKNOWN",
          duration:
            (new Date(session.endTime).getTime() -
              new Date(session.startTime).getTime()) /
            1000,
          startTime: session.startTime,
          endTime: session.endTime,
        }));

        setHistory(sessions);
      } catch (error) {
        console.error("Error fetching timer sessions:", error);
      }
    };

    fetchTimerSessions();
  }, []);

  const totalFocusHours =
    history.reduce((acc, s) => acc + s.duration, 0) / 3600;

  const clearHistory = async () => {
    try {
      const response = await fetch("/api/timer-sessions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: "83482f49-8367-48d1-93f0-e98f01010f0f" }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to clear history");
      }

      console.log("History cleared:", data.message);
      alert("History cleared successfully!");
      setHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error.message);
      alert("Failed to clear history. Please try again.");
    }
  };

  return { history, totalFocusHours, clearHistory };
};