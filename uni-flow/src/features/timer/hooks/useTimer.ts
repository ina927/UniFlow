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

  // User & subjects
  const [userId, setUserId] = useState<string | null>(null);
  const { subjects } = useSubjects();

  const [showNotification, setShowNotification] = useState(false);
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const hasStarted = useRef(false);

  // ✅ Fetch logged-in user once
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (res.status === 401) {
          console.warn("User not logged in");
          setUserId(null);
          return;
        }

        const data = await res.json();
        setUserId(data.user?.id || null);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  // Helper to compute next break time
  const getNextBreakTime = () =>
    (completedPomodoros + 1) % longBreakInterval === 0
      ? longBreakTime
      : shortBreakTime;

  // Handle when a session ends
  const handleSessionEnd = () => {
    setIsActive(false);
    setShowNotification(true);
    if (alarmRef.current) alarmRef.current.play();

    // ✅ Save session only if logged in and it's a work session
    if (isWorkTime && userId) {
      const endTime = new Date().toISOString();
      const startTime = new Date(Date.now() - workTime * 1000).toISOString();

      fetch("/api/timer-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          startTime,
          endTime,
          userId,
          todoId: currentTask?.id || null,
          taskName: currentTask?.id ? currentTask.title : "Study Session",
          subjectName: currentTask?.id
            ? (subjects ?? []).find(
                (subject) => subject.id === currentTask?.subjectId
              )?.title || "Other"
            : "Other",
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to save timer session");
          return res.json();
        })
        .then((data) => console.log("Timer session saved:", data))
        .catch((err) => console.error("Error saving timer session:", err));
    } else if (!userId) {
      console.warn("Skipping timer session save — user not logged in");
    }

    // Transition between work/break
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

  // Timer control functions
  const toggle = () => {
    if (!isActive) hasStarted.current = true;
    setIsActive((prev) => !prev);
  };

  const reset = () => {
    setIsActive(false);
    setCompletedPomodoros(0);
    hasStarted.current = false;
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

  // Update secondsLeft when durations change
  useEffect(() => {
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

  // Countdown tick
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  // Detect when time runs out
  useEffect(() => {
    if (secondsLeft === 0 && isActive) {
      handleSessionEnd();
    }
  }, [secondsLeft, isActive]);

  return {
    workTime,
    setWorkTime,
    shortBreakTime,
    setShortBreakTime,
    longBreakTime,
    setLongBreakTime,
    longBreakInterval,
    setLongBreakInterval,

    // Auto-start options
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
