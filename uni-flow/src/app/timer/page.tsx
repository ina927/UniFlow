"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function TimerPage() {
  // Default times (in seconds)
  const [workTime, setWorkTime] = useState(0.1 * 60);
  const [shortBreakTime, setShortBreakTime] = useState(5 * 60);
  const [longBreakTime, setLongBreakTime] = useState(15 * 60);

  const [secondsLeft, setSecondsLeft] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // ✅ Track completion status
  const [isComplete, setIsComplete] = useState(false);

  // ✅ Task type definition
  type Task = {
    id: string | number;
    title: string;
    endDate?: string;
  };

  // ✅ State for tasks
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/todos");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch tasks");
        }

        setTasks(data.todos);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

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
    setIsComplete(false); // reset completion state
  };

  const skip = () => {
    if (isWorkTime) {
      setIsWorkTime(false);
      setSecondsLeft(shortBreakTime);
    } else {
      setIsWorkTime(true);
      setSecondsLeft(workTime);
    }
    setIsComplete(false); // skip resets completion
  };

  const saveTimerSession = async (session: {
    startTime: string;
    endTime: string;
    userId: string;
    todoId?: string;
  }) => {
    try {
      const response = await fetch("/api/timer-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save timer session");
      }

      console.log("Timer session saved:", data.timerSession);
    } catch (error) {
      console.error("Error saving timer session:", error);
    }
  };

  useEffect(() => {
    if (secondsLeft === 0 && isActive) {
      const endTime = new Date().toISOString();
      const startTime = new Date(Date.now() - workTime * 1000).toISOString();

      if (isWorkTime) {
        // Save completed work session to the database
        saveTimerSession({
          startTime,
          endTime,
          userId: "83482f49-8367-48d1-93f0-e98f01010f0f", // Replace with actual userId
          todoId: tasks.length > 0 ? tasks[0].id.toString() : undefined, // Example: Link to the first task
        });

        setIsWorkTime(false);
        setSecondsLeft(shortBreakTime);
      } else {
        setIsWorkTime(true);
        setSecondsLeft(workTime);
      }
    }
  }, [secondsLeft, isActive, isWorkTime, workTime, shortBreakTime, tasks]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-components-fill">
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

      {/* Main content */}
      <div className="relative rounded-lg shadow-lg p-8 bg-primary-light flex flex-col items-center">
        <h1 className="text-title1 mt-8 text-white">
          {isWorkTime ? "Work Time" : "Break Time"}
        </h1>
        <div className="text-large-title-bold my-4 text-white">
          {formatTime(secondsLeft)}
        </div>
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
            className="px-4 py-2 rounded bg-button-deactive-light text-white mr-2"
          >
            Skip
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-title2-bold mb-4 text-primary">Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-lg shadow-md bg-white border border-primary-light"
            >
              <h3 className="text-body1-bold text-primary mb-2">{task.title}</h3>
              <p className="text-body2 text-gray-600">
                {task.endDate
                  ? new Date(task.endDate).toLocaleDateString()
                  : "No due date"}
              </p>
            </div>
          ))}
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
                onChange={(e) => setWorkTime(Number(e.target.value) * 60)}
                className="ml-2 px-2 py-1 rounded border border-primary-light w-20"
              />
            </label>
            <label className="mb-2 w-full text-body1 text-primary">
              Short Break (minutes):
              <input
                type="number"
                min={1}
                value={shortBreakTime / 60}
                onChange={(e) => setShortBreakTime(Number(e.target.value) * 60)}
                className="ml-2 px-2 py-1 rounded border border-primary-light w-20"
              />
            </label>
            <label className="mb-4 w-full text-body1 text-primary">
              Long Break (minutes):
              <input
                type="number"
                min={1}
                value={longBreakTime / 60}
                onChange={(e) => setLongBreakTime(Number(e.target.value) * 60)}
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