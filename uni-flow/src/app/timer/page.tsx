"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function TimerPage() {
  const workTime = 1 * 60; // 1 minute for testing
  const breakTime = 5 * 60; // 5 minutes

  const [secondsLeft, setSecondsLeft] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
useEffect(() => {
  let interval: NodeJS.Timeout;
  if (isActive) {
    interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
  }
  return () => {
    if (interval) clearInterval(interval);
  };
}, [isActive]);

useEffect(() => {
  if (secondsLeft === 0 && isActive) {
    if (isWorkTime) {
      // Save completed work session
      const history = JSON.parse(localStorage.getItem("history") || "[]");
      history.push({
        subject: "Other",
        duration: workTime,
        startTime: new Date(Date.now() - workTime * 1000).toISOString(),
        endTime: new Date().toISOString(),
      });
      localStorage.setItem("history", JSON.stringify(history));
      setIsWorkTime(false);
      setSecondsLeft(breakTime);
    } else {
      setIsWorkTime(true);
      setSecondsLeft(workTime);
    }
  }
}, [secondsLeft, isActive, isWorkTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setSecondsLeft(workTime);
    setIsWorkTime(true);
  };

  const skip = () => {
    if (isWorkTime) {
      setIsWorkTime(false);
      setSecondsLeft(breakTime);
    };
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-components-fill">
              {/* History button in top right */}
        <Link href="/history">
          <button
            className="absolute top-4 right-4 px-4 py-2 bg-primary-light text-white rounded shadow text-body1-bold hover:bg-button-hover-light"
          >
            History
          </button>
          </Link>
      <div className="relative rounded-lg shadow-lg p-8 bg-primary-light">
        <h1 className="text-title1 mt-8 text-white">
          {isWorkTime ? "Work Time" : "Break Time"}
        </h1>
        <div className="text-large-title-bold my-4 text-white">{formatTime(secondsLeft)}</div>
        <div>
          <button
            onClick={toggle}
            className={`px-4 py-2 mr-2 rounded text-body1-bold ${
              isActive
                ? "bg-button-active-light text-white"
                : "bg-button-deactive-light text-white"
            }`}
          >
            {isActive ? "Pause" : "Start"}
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 rounded bg-components-fill text-primary"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}