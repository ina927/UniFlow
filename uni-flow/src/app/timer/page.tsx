"use client";
import { useState, useEffect } from "react";

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
        setSecondsLeft((prev) => {
          if (prev === 0) {
            if (isWorkTime) {
              // ✅ Save completed work session
              const history = JSON.parse(localStorage.getItem("history") || "[]");
              history.push({
                subject: "Other",
                duration: workTime,
                startTime: new Date(Date.now() - workTime * 1000).toISOString(),
                endTime: new Date().toISOString(),
              });
              localStorage.setItem("history", JSON.stringify(history));

              setIsWorkTime(false);
              return breakTime;
            } else {
              setIsWorkTime(true);
              return workTime;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isWorkTime]);

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

  return (
    <div>
      <h1 >
        {isWorkTime ? "Work Time" : "Break Time"}
      </h1>
      <div>{formatTime(secondsLeft)}</div>
      <div>
        <button
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setIsActive(false);
            setSecondsLeft(workTime);
            setIsWorkTime(true);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
