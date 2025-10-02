import { useState, useEffect, useRef } from "react";
import { useSubjects } from "@/features/timer/hooks/useSubjects";

export const useTimer = ({
  currentTask,
}: {
  currentTask: any;
  setCurrentTask: (task: any) => void;
}) => {
  // Timer durations (in seconds)
  const [workTime, setWorkTime] = useState(0.1 * 60);
  const [shortBreakTime, setShortBreakTime] = useState(5 * 60);
  const [longBreakTime, setLongBreakTime] = useState(15 * 60);
  const [longBreakInterval, setLongBreakInterval] = useState(4);

  // Timer states
  const [secondsLeft, setSecondsLeft] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  // Auto-start settings
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [autoStartPomodoro, setAutoStartPomodoro] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  // Subject hook
  const { subjects } = useSubjects();

  const hasStarted = useRef(false); // ✅ Step 1: Add a hasStarted ref

  // 👉 Helper to compute next break time
  const getNextBreakTime = () => {
    return (completedPomodoros + 1) % longBreakInterval === 0
      ? longBreakTime
      : shortBreakTime;
  };

  // 👉 Handle when a session ends
  const handleSessionEnd = () => {
    setIsActive(false);
    setShowNotification(true);
    if (alarmRef.current) {
      alarmRef.current.play();
    }

    // Save work session to backend
    if (isWorkTime) {
      const endTime = new Date().toISOString();
      const startTime = new Date(Date.now() - workTime * 1000).toISOString();

      fetch("/api/timer-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime,
          endTime,
          userId: "83482f49-8367-48d1-93f0-e98f01010f0f",
          todoId: currentTask?.id || null,
          taskName: currentTask?.id ? currentTask.title : "Study Session",
          subjectName: currentTask?.id
            ? (subjects ?? []).find(
                (subject) => subject.id === currentTask?.subjectId
              )?.title || "Other"
            : "Other",
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to save timer session");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Timer session saved:", data);
        })
        .catch((error) => {
          console.error("Error saving timer session:", error);
        });
    }

    // Transition between work and break
    if (isWorkTime) {
      setCompletedPomodoros((prev) => prev + 1);
      setIsWorkTime(false);
      const nextBreak = getNextBreakTime();
      setSecondsLeft(nextBreak);
      if (autoStartBreaks) setIsActive(true);
    } else {
      setIsWorkTime(true);
      setSecondsLeft(workTime);
      if (autoStartPomodoro) setIsActive(true);
    }
  };

  // 👉 Control functions
  const toggle = () => {
    if (!isActive) {
      hasStarted.current = true; // ✅ Step 2: Mark as started on first start
    }
    setIsActive((prev) => !prev);
  };

  const reset = () => {
    setIsActive(false);
    setCompletedPomodoros(0);
    hasStarted.current = false; // Reset hasStarted on reset
    setSecondsLeft(isWorkTime ? workTime : getNextBreakTime());
  };

  const skip = () => {
    setIsActive(false);
    if (isWorkTime) {
      setIsWorkTime(false);
      setSecondsLeft(getNextBreakTime());
    } else {
      setIsWorkTime(true);
      setSecondsLeft(workTime);
    }
  };

  // ⏱ Update secondsLeft when timer settings change (only if stopped and never started)
  useEffect(() => {
    // ✅ Step 3: Only reset if timer has never started
    if (!isActive && !hasStarted.current) {
      setSecondsLeft(isWorkTime ? workTime : getNextBreakTime());
    }
  }, [
    workTime,
    shortBreakTime,
    longBreakTime,
    longBreakInterval,
    isWorkTime,
    isActive,
  ]);

  // ⏳ Timer countdown (cleaner)
  useEffect(() => {
    if (!isActive) return; // Do nothing if not active

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 0) return prev - 1;
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval); // Clear interval on pause or unmount
  }, [isActive]);

  // ⏰ Handle session end when timer reaches zero
  useEffect(() => {
    if (secondsLeft === 0 && isActive) {
      handleSessionEnd();
    }
  }, [secondsLeft, isActive]);

  return {
    // Timer config
    workTime,
    setWorkTime,
    shortBreakTime,
    setShortBreakTime,
    longBreakTime,
    setLongBreakTime,
    longBreakInterval,
    setLongBreakInterval,

    // Auto-start
    autoStartBreaks,
    setAutoStartBreaks,
    autoStartPomodoro,
    setAutoStartPomodoro,

    // Timer state
    secondsLeft,
    isActive,
    isWorkTime,
    toggle,
    reset,
    skip,

    // Notifications
    alarmRef,
    showNotification,
    setShowNotification,

    completedPomodoros,
  };
};
