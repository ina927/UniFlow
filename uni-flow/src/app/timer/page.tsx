"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function TimerPage() {
  // Default times (in seconds)
  const [workTime, setWorkTime] = useState(25 * 60);
  const [shortBreakTime, setShortBreakTime] = useState(5 * 60);
  const [longBreakTime, setLongBreakTime] = useState(15 * 60);

  const [secondsLeft, setSecondsLeft] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setSecondsLeft(workTime);
  }, [workTime]);

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
        setSecondsLeft(shortBreakTime);
      } else {
        setIsWorkTime(true);
        setSecondsLeft(workTime);
      }
    }
  }, [secondsLeft, isActive, isWorkTime, workTime, shortBreakTime]);

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
      setSecondsLeft(shortBreakTime);
    } else {
      setIsWorkTime(true);
      setSecondsLeft(workTime);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-components-fill">
      {/* Top right buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Link href="/history">
          <button
            className="px-4 py-2 bg-primary-light text-white rounded shadow text-body1-bold hover:bg-button-hover-light"
          >
            History
          </button>
        </Link>
        <button
          className="px-4 py-2 bg-button-deactive-light text-white rounded shadow text-body1-bold hover:bg-button-hover-light"
          onClick={() => setShowSettings(true)}
        >
          Settings
        </button>
      </div>
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
            className="px-4 py-2 rounded bg-components-fill text-primary mr-2"
          >
            Reset
          </button>
          <button
            onClick={skip}
            className="px-4 py-2 rounded bg-button-deactive-light text-white"
          >
            Skip
          </button>
        </div>
      </div>
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] flex flex-col items-center">
            <h2 className="text-title2-bold mb-4 text-primary">Timer Settings</h2>
            <label className="mb-2 w-full text-body1 text-primary">
              Pomodoro (minutes):
              <input
                type="number"
                min={1}
                value={workTime / 60}
                onChange={e => setWorkTime(Number(e.target.value) * 60)}
                className="ml-2 px-2 py-1 rounded border border-primary-light w-20"
              />
            </label>
            <label className="mb-2 w-full text-body1 text-primary">
              Short Break (minutes):
              <input
                type="number"
                min={1}
                value={shortBreakTime / 60}
                onChange={e => setShortBreakTime(Number(e.target.value) * 60)}
                className="ml-2 px-2 py-1 rounded border border-primary-light w-20"
              />
            </label>
            <label className="mb-4 w-full text-body1 text-primary">
              Long Break (minutes):
              <input
                type="number"
                min={1}
                value={longBreakTime / 60}
                onChange={e => setLongBreakTime(Number(e.target.value) * 60)}
                className="ml-2 px-2 py-1 rounded border border-primary-light w-20"
              />
            </label>
            <button
              className="px-4 py-2 bg-primary-light text-white rounded shadow text-body1-bold hover:bg-button-hover-light"
              onClick={() => setShowSettings(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}