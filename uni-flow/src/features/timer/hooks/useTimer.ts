import { useState, useEffect, useRef } from "react";
import { useSubjects } from "@/features/timer/hooks/useSubjects";

export const useTimer = ({
  currentTask,
  setCurrentTask,
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

  // Control functions
  const toggle = () => setIsActive((prev) => !prev);

  const reset = () => {
    setIsActive(false);
    setCompletedPomodoros(0);
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

  const getNextBreakTime = () => {
    return (completedPomodoros + 1) % longBreakInterval === 0 ? longBreakTime : shortBreakTime;
  };

  // ⏱ Update secondsLeft when timer settings change (only if timer is stopped)
  useEffect(() => {
    if (!isActive) {
      setSecondsLeft(isWorkTime ? workTime : getNextBreakTime());
    }
  }, [workTime, shortBreakTime, longBreakTime, longBreakInterval, isWorkTime, isActive]);

  // ⏳ Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      clearInterval(interval);
      setIsActive(false);
      setShowNotification(true);
      if (alarmRef.current) {
        alarmRef.current.play();
      }

      const endTime = new Date().toISOString();
      const startTime = new Date(Date.now() - (isWorkTime ? workTime : getNextBreakTime()) * 1000).toISOString();

      // Save the timer session using the API
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
            ? (subjects ?? []).find((subject) => subject.id === currentTask?.subjectId)?.title || "Other"
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

      // Transition between work and break
      if (isWorkTime) {
        setCompletedPomodoros((prev) => prev + 1);
        setIsWorkTime(false);
        const nextBreak = getNextBreakTime();
        setSecondsLeft(nextBreak);
        if (autoStartBreaks) {
          setIsActive(true);
        }
      } else {
        setIsWorkTime(true);
        setSecondsLeft(workTime);
        if (autoStartPomodoro) {
          setIsActive(true);
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, isWorkTime, workTime, shortBreakTime, longBreakTime, longBreakInterval, currentTask, subjects, autoStartBreaks, autoStartPomodoro]);

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
  };
};
