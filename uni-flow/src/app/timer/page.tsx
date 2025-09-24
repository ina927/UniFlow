"use client";
import { useState, useEffect, useRef } from "react";
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

  // ✅ Track completion status
  const [isComplete, setIsComplete] = useState(false);

  // ✅ Notification popup state
  const [showNotification, setShowNotification] = useState(false);

  // ✅ Ref for alarm sound
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  // ✅ Auto-start settings
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [autoStartPomodoro, setAutoStartPomodoro] = useState(false);

  // ✅ Long break interval setting
  const [longBreakInterval, setLongBreakInterval] = useState(4); // Default: 4 pomodoros
  const [completedPomodoros, setCompletedPomodoros] = useState(0); // Track completed pomodoros

  // Task type definition
  type Task = {
    id: string;
    title: string;
    description?: string;
    status: string;
    startDate?: string;
    endDate?: string;
  };

  // State for tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  type Subject = {
    id: string;
    title: string;
  };
  const [currentTask, setCurrentTask] = useState<Task | null>(null); // State for the current task
  const [subjects, setSubjects] = useState<Subject[]>([]); // State for subjects
  const [showAddTodoForm, setShowAddTodoForm] = useState(false);

  // State for new ToDo item details
  const [newTodo, setNewTodo] = useState({
    userId: "83482f49-8367-48d1-93f0-e98f01010f0f", // Replace with actual userId
    subjectId: "",
    assessmentId: "", // Optional
    title: "",
    content: "",
    endDate: "",
    taskStatus: "IN_PROGRESS", // Default status
  });

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/todos");
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        // API returns array directly
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  // Fetch subjects from the backend
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("/api/subjects", {
          headers: {
            "user-id": "83482f49-8367-48d1-93f0-e98f01010f0f", // Replace with the actual user ID
          },
        });
        const data = await response.json();

        console.log("Fetched Subjects:", data); // Debugging log

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch subjects");
        }

        setSubjects(data.data); // Assuming `data.data` contains the list of subjects
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  const addTodo = async () => {
    try {
      // Validate required fields
      if (!newTodo.title.trim()) {
        alert("Title is required.");
        return;
      }
      if (!newTodo.endDate.trim()) {
        alert("End Date is required.");
        return;
      }
      if (!newTodo.userId.trim()) {
        alert("User ID is missing. Please log in.");
        return;
      }

      // Automatically set the startDate to the current date
      const todoWithStartDate = {
        ...newTodo,
        startDate: new Date().toISOString(),
      };

      console.log("Adding ToDo:", todoWithStartDate); // Debugging log

      const response = await fetch("/api/todos", {
        method: "POST",
        headers:
          {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({ newToDo: todoWithStartDate }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to add ToDo item");
      }

      console.log("ToDo item added:", data);
      setShowAddTodoForm(false); // Close the form after adding
      setTasks((prev) => [...prev, data]); // Update the task list
    } catch (error) {
      console.error("Error adding ToDo item:", error.message);
      alert(error.message); // Show error to the user
    }
  };

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
          todoId: currentTask?.id, // Use the current task's ID
        });

        setCompletedPomodoros((prev) => prev + 1); // Increment completed pomodoros

        // Check if it's time for a long break
        if ((completedPomodoros + 1) % longBreakInterval === 0) {
          setIsWorkTime(false);
          setSecondsLeft(longBreakTime);
        } else {
          setIsWorkTime(false);
          setSecondsLeft(shortBreakTime);
        }

        // Auto-start break if enabled
        if (autoStartBreaks) {
          setIsActive(true);
        } else {
          setIsActive(false);
        }
      } else {
        setIsWorkTime(true);
        setSecondsLeft(workTime);

        // Auto-start pomodoro if enabled
        if (autoStartPomodoro) {
          setIsActive(true);
        } else {
          setIsActive(false);
        }
      }

      // Play alarm sound
      if (alarmRef.current) {
        alarmRef.current.play();
      }

      // Show notification popup
      setShowNotification(true);

      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }
  }, [secondsLeft, isActive, isWorkTime, workTime, shortBreakTime, currentTask, completedPomodoros, longBreakInterval]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-components-fill">
      {/* Top right buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Link href="/history">
          <button className="px-4 py-2 bg-primary-light text-white rounded shadow text-body1-bold hover:bg-button-hover-light">
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

      {/* Timer Section */}
      <div className="relative rounded-lg shadow-lg p-8 bg-primary-light flex flex-col items-center w-full max-w-[1920px] max-h-[1080px]">
        <h1 className="text-title1 mt-8 text-white">
          {isWorkTime ? "Work Time" : "Break Time"}
        </h1>
        <div className="text-large-title-bold my-4 text-white">
          {formatTime(secondsLeft)}
        </div>
        {currentTask && (
          <div className="text-body1 text-white mt-2">
            Current Task: <strong>{currentTask.title}</strong>
          </div>
        )}
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
          <button
            onClick={skip}
            className="px-4 py-2 rounded bg-button-deactive-light text-white mr-2"
          >
            Skip
          </button>
        </div>
      </div>

      {/* Notification Popup */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-primary-light text-white px-6 py-4 rounded-lg shadow-lg z-50">
          <p className="text-body1-bold">Timer is complete!</p>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-title2-bold mb-4 text-primary">Timer Settings</h2>
            <label className="mb-4 w-full text-body1 text-primary flex flex-col">
              Pomodoro (minutes):
              <input
                type="number"
                min={1}
                value={workTime / 60}
                onChange={(e) => setWorkTime(Number(e.target.value) * 60)}
                className="mt-1 px-2 py-1 rounded border border-primary-light"
              />
            </label>
            <label className="mb-4 w-full text-body1 text-primary flex flex-col">
              Short Break (minutes):
              <input
                type="number"
                min={1}
                value={shortBreakTime / 60}
                onChange={(e) => setShortBreakTime(Number(e.target.value) * 60)}
                className="mt-1 px-2 py-1 rounded border border-primary-light"
              />
            </label>
            <label className="mb-4 w-full text-body1 text-primary flex flex-col">
              Long Break (minutes):
              <input
                type="number"
                min={1}
                value={longBreakTime / 60}
                onChange={(e) => setLongBreakTime(Number(e.target.value) * 60)}
                className="mt-1 px-2 py-1 rounded border border-primary-light"
              />
            </label>
            <label className="mb-4 w-full text-body1 text-primary flex flex-col">
              Long Break Interval (Pomodoros):
              <input
                type="number"
                min={1}
                value={longBreakInterval}
                onChange={(e) => setLongBreakInterval(Number(e.target.value))}
                className="mt-1 px-2 py-1 rounded border border-primary-light"
              />
            </label>
            <label className="mb-4 w-full text-body1 text-primary flex items-center">
              <input
                type="checkbox"
                checked={autoStartBreaks}
                onChange={(e) => setAutoStartBreaks(e.target.checked)}
                className="mr-2"
              />
              Auto Start Breaks
            </label>
            <label className="mb-4 w-full text-body1 text-primary flex items-center">
              <input
                type="checkbox"
                checked={autoStartPomodoro}
                onChange={(e) => setAutoStartPomodoro(e.target.checked)}
                className="mr-2"
              />
              Auto Start Pomodoro
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

      {/* Add ToDo Form */}
      {showAddTodoForm && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-title3-bold mb-4">Add ToDo Item</h3>
          <div className="flex flex-col gap-4">
            {/* Title */}
            <label>
              Title:
              <input
                type="text"
                value={newTodo.title}
                onChange={(e) =>
                  setNewTodo({
                    ...newTodo,
                    title: e.target.value,
                  })
                }
                className="ml-2 px-2 py-1 rounded border border-primary-light w-full"
                placeholder="Enter task title"
                required
              />
            </label>

            {/* Content */}
            <label>
              Content:
              <textarea
                value={newTodo.content}
                onChange={(e) =>
                  setNewTodo({
                    ...newTodo,
                    content: e.target.value,
                  })
                }
                className="ml-2 px-2 py-1 rounded border border-primary-light w-full"
                placeholder="Enter task content"
              />
            </label>

            {/* End Date */}
            <label>
              End Date:
              <input
                type="date"
                value={newTodo.endDate}
                onChange={(e) =>
                  setNewTodo({
                    ...newTodo,
                    endDate: e.target.value,
                  })
                }
                className="ml-2 px-2 py-1 rounded border border-primary-light"
                required
              />
            </label>

            {/* Subject Dropdown */}
            <label>
              Subject:
              <select
                value={newTodo.subjectId}
                onChange={(e) =>
                  setNewTodo({
                    ...newTodo,
                    subjectId: e.target.value,
                  })
                }
                className="ml-2 px-2 py-1 rounded border border-primary-light w-full"
              >
                <option value="">Select a subject</option>
                {Array.isArray(subjects) &&
                  subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.title}
                    </option>
                  ))}
              </select>
            </label>

            {/* Save Button */}
            <button
              onClick={addTodo}
              className="px-4 py-2 bg-primary-light text-white rounded shadow"
            >
              Save ToDo
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="mt-8 w-full max-w-[1920px]">
        <h2 className="text-title2-bold mb-4 text-primary">Tasks</h2>
        <button
          onClick={() => setShowAddTodoForm(!showAddTodoForm)}
          className="px-4 py-2 bg-primary-light text-white rounded shadow"
        >
          {showAddTodoForm ? "Cancel" : "Add ToDo"}
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {Array.isArray(tasks) && tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className="p-6 rounded-lg shadow-md bg-white border border-primary-light flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-body1-bold text-primary mb-2">
                    {task.title}
                  </h3>
                  <p className="text-body2 text-gray-600 mb-2">
                    {task.description || "No description provided"}
                  </p>
                </div>
                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  {task.startDate && (
                    <p>
                      Start: {new Date(task.startDate).toLocaleDateString()}
                    </p>
                  )}
                  {task.endDate && (
                    <p>
                      Due: {new Date(task.endDate).toLocaleDateString()}
                    </p>
                  )}
                  <p>
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        task.status === "COMPLETED"
                          ? "text-green-600"
                          : task.status === "IN_PROGRESS"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {task.status}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTask(task)}
                  className="mt-4 px-4 py-2 bg-primary-light text-white rounded shadow"
                >
                  Add to Timer
                </button>
              </div>
            ))
          ) : (
            <p className="text-body2 text-gray-600">No tasks available.</p>
          )}
        </div>
      </div>

      {/* Alarm Sound */}
      <audio ref={alarmRef} src="/alarm.mp3" preload="auto" />
    </div>
  );
}