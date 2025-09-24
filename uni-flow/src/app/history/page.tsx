"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Session = {
  id: string;
  subject?: string; // Optional if linked to a ToDo
  taskTitle?: string;
  taskStatus?: string;
  duration: number;
  startTime: string;
  endTime: string;
};

export default function HistoryPage() {
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

        // Map the fetched data to include duration and task details
        const sessions = data.timerSessions.map((session: any) => ({
          id: session.id,
          subject: session.todo?.subject?.title || "No Subject",
          taskTitle: session.todo?.title || "Unnamed Task", // Use the title from the ToDo
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
        body: JSON.stringify({ userId: "83482f49-8367-48d1-93f0-e98f01010f0f" }), // Replace with actual userId
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to clear history");
      }

      console.log("History cleared:", data.message);
      alert("History cleared successfully!");

      // Optionally, reset the tasks or timer sessions in the frontend
      setHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error.message);
      alert("Failed to clear history. Please try again.");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-components-fill">
      {/* Top right buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Link href="/timer">
          <button
            className="px-4 py-2 bg-primary-light text-white rounded shadow text-body1-bold hover:bg-button-hover-light"
          >
            Timer
          </button>
        </Link>
        <button
          onClick={clearHistory}
          className="px-4 py-2 bg-button-deactive-light text-white rounded shadow text-body1-bold hover:bg-button-hover-light"
        >
          Clear History
        </button>
      </div>

      {/* Page Title */}
      <h1 className="text-title1 mb-8 text-center">Study Session History</h1>

      {/* Total Focus Hours */}
      <div className="bg-primary-light rounded-lg shadow-lg px-8 py-6 mb-8 flex flex-col items-center w-full max-w-[1920px] max-h-[1080px]">
        <span className="text-title2-bold text-white mb-2">Total Focus Hours</span>
        <span className="text-large-title-bold text-white">{totalFocusHours.toFixed(2)} hrs</span>
      </div>

      {/* Task List */}
      <div className="w-full h-full px-6">
        <span className="text-title2-bold text-primary mb-4 block">Tasks</span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[80vh] overflow-y-auto">
          {history.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl shadow-md border border-primary-light p-4 flex flex-col justify-between h-48"
            >
              <h3 className="text-body1-bold text-primary mb-2">{s.taskTitle}</h3>
              <p className="text-sm text-gray-600 mb-1">
                Subject: <span className="font-medium">{s.subject}</span>
              </p>
              <div className="mt-auto text-sm text-gray-700">
                <p>Duration: {(s.duration / 60).toFixed(0)} mins</p>
                <p>
                  {new Date(s.startTime).toLocaleTimeString()} →{" "}
                  {new Date(s.endTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}