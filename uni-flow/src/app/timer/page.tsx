"use client";
import { useState } from "react";
import { TimerDisplay } from "@/features/timer/ui/TimerDisplay";
import { TimerControls } from "@/features/timer/ui/TimerControls";
import { TaskList } from "@/features/timer/ui/TaskList";
import { AddTodoForm } from "@/features/timer/ui/AddTodoForm";
import SettingsModel from "@/features/timer/ui/SettingsModel";
import NotificationPopup from "@/features/timer/ui/NotificationPopup";
import TimerHeader from "@/features/timer/ui/TimerHeader";
import { useTimer } from "@/features/timer/hooks/useTimer";
import { useTasks } from "@/features/timer/hooks/useTasks";
import { useSubjects } from "@/features/timer/hooks/useSubjects";

export default function TimerPage() {
  // Task and subject logic
  const { tasks, setTasks, currentTask, setCurrentTask, deleteTodo, addTodo, newTodo, setNewTodo } = useTasks();

  const timer = useTimer({ currentTask, setCurrentTask });

  const {
    workTime,
    setWorkTime,
    shortBreakTime,
    setShortBreakTime,
    longBreakTime,
    setLongBreakTime,
    longBreakInterval,
    setLongBreakInterval,
    autoStartBreaks,
    setAutoStartBreaks,
    autoStartPomodoro,
    setAutoStartPomodoro,
    secondsLeft,
    isActive,
    isWorkTime,
    toggle,
    reset,
    skip,
    alarmRef,
    showNotification,
    setShowNotification,
  } = timer;

  // State for modals
  const [showSettings, setShowSettings] = useState(false);
  const [showAddTodoForm, setShowAddTodoForm] = useState(false);

  return (
    <div className="min-h-screen w-screen bg-background text-foreground">
      {/* Timer Header */}
      <TimerHeader
        onToggleAddTodo={() => setShowAddTodoForm(!showAddTodoForm)}
        showAddTodoForm={showAddTodoForm}
        onToggleSettings={() => setShowSettings(!showSettings)}
        showSettings={showSettings}
      />

      {/* Main Content */}
      <div className="px-4 py-8">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center gap-6">
          <TimerDisplay
            isWorkTime={isWorkTime}
            secondsLeft={secondsLeft}
            currentTask={currentTask}
            formatTime={(seconds) => {
              const mins = Math.floor(seconds / 60);
              const secs = seconds % 60;
              return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
            }}
          />
          <TimerControls isActive={isActive} toggle={toggle} reset={reset} skip={skip} />
          <TaskList tasks={tasks} setCurrentTask={setCurrentTask} deleteTodo={deleteTodo} />
        </div>
      </div>

      {/* Add ToDo Form */}
      {showAddTodoForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <AddTodoForm
              newTodo={newTodo}
              setNewTodo={setNewTodo}
              subjects={subjects}
              addTodo={addTodo}
              onCancel={() => setShowAddTodoForm(false)} 
            />
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <SettingsModel
              workTime={workTime}
              setWorkTime={setWorkTime}
              shortBreakTime={shortBreakTime}
              setShortBreakTime={setShortBreakTime}
              longBreakTime={longBreakTime}
              setLongBreakTime={setLongBreakTime}
              longBreakInterval={longBreakInterval}
              setLongBreakInterval={setLongBreakInterval}
              autoStartBreaks={autoStartBreaks}
              setAutoStartBreaks={setAutoStartBreaks}
              autoStartPomodoro={autoStartPomodoro}
              setAutoStartPomodoro={setAutoStartPomodoro}
              closeSettings={() => setShowSettings(false)}
            />
          </div>
        </div>
      )}

      {/* Notification Popup */}
      {showNotification && (
        <NotificationPopup
          message="Pomodoro session completed!"
          onClose={() => setShowNotification(false)}
        />
      )}

      {/* Alarm Sound */}
      <audio ref={alarmRef} src="/alarm.mp3" preload="auto" />
    </div>
  );
}