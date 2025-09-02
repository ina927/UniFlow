"use client";
import { useEffect, useState } from "react";

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

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Study Session History</h1>
      <p>
        <strong>Total Focus Hours:</strong> {totalFocusHours.toFixed(2)} hrs
      </p>
      <ul>
        {history.map((s, i) => (
          <li key={i}>
            {s.subject} – {(s.duration / 60).toFixed(0)} mins (
            {new Date(s.startTime).toLocaleTimeString()} →{" "}
            {new Date(s.endTime).toLocaleTimeString()})
          </li>
        ))}
      </ul>
    </div>
  );
}
