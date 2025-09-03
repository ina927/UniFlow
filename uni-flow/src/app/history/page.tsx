"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Session = {
  subject: string;
  duration: number;
  startTime: string;
  endTime: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<Session[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("history") || "[]");
    setHistory(stored);
  }, []);

  const totalFocusHours =
    history.reduce((acc, s) => acc + s.duration, 0) / 3600;

    const clearHistory = () => {
        localStorage.removeItem("history");
        setHistory([]);
        }

  return (
    <div className="min-h-screen bg-components-fill flex flex-col items-center py-8">
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
      <h1 className="text-title1 mb-8">Study Session History</h1>
      <div className="bg-primary-light rounded-lg shadow-lg px-8 py-6 mb-8 flex flex-col items-center">
        <span className="text-title2-bold text-white mb-2">Total Focus Hours</span>
        <span className="text-large-title-bold text-white">{totalFocusHours.toFixed(2)} hrs</span>
      </div>
      <ul className="w-full max-w-xl">
        <div className="bg-white rounded-lg shadow px-6 py-4 mb-4">
          <span className="text-title2-bold text-primary mb-4 block">Tasks</span>
          {history.map((s, i) => (
            <li
              key={i}
              className="bg-components-fill rounded px-4 py-2 mb-2 shadow text-body1 text-primary"
            >
              {s.subject} – {(s.duration / 60).toFixed(0)} mins (
              {new Date(s.startTime).toLocaleTimeString()} →{" "}
              {new Date(s.endTime).toLocaleTimeString()})
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
}