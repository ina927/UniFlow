'use client';

import { useEffect, useState } from 'react';

import { fetchSubjectsForUser } from '@/features/timer/api/subjects';
import { useTasks } from '@/features/timer/hooks/useTasks';
import { useTimer } from '@/features/timer/hooks/useTimer';
import { AddTodoForm } from '@/features/timer/ui/AddTodoForm';
import NotificationPopup from '@/features/timer/ui/NotificationPopup';
import SettingsModel from '@/features/timer/ui/SettingsModel';
import { TaskList } from '@/features/timer/ui/TaskList';
import { TimerDisplay } from '@/features/timer/ui/TimerDisplay';
import TimerHeader from '@/features/timer/ui/TimerHeader';
import { isLogin } from '@/shared/lib/isLogin';
import { SubjectEntity } from '@/entities';

export default function TimerPage() {
  isLogin();

  const {
    tasks,
    setTasks,
    currentTask,
    setCurrentTask,
    deleteTodo,
    addTodo,
    newTodo,
    setNewTodo,
    userId, 
  } = useTasks();

  const [subjects, setSubjects] = useState<SubjectEntity[]>([]);

  useEffect(() => {
    if (!userId) return; // wait for user to be available
    fetchSubjectsForUser(userId).then(setSubjects).catch(console.error);
  }, [userId]);

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
    completedPomodoros,
  } = timer;

  const [showSettings, setShowSettings] = useState(false);
  const [showAddTodoForm, setShowAddTodoForm] = useState(false);

  return (
    <div className='flex flex-col min-h-screen w-screen bg-background text-foreground'>
      {/* Timer Header */}
      <TimerHeader
        onToggleAddTodo={() => setShowAddTodoForm(!showAddTodoForm)}
        showAddTodoForm={showAddTodoForm}
        onToggleSettings={() => setShowSettings(!showSettings)}
        showSettings={showSettings}
      />

      {/* Main Content - takes remaining height and scrolls if needed */}
      <main className='flex-1 overflow-y-auto px-4 py-8'>
        <div className='max-w-screen-xl ml-60 flex flex-col items-center gap-6'>
          <TimerDisplay
            isWorkTime={isWorkTime}
            secondsLeft={secondsLeft}
            currentTask={currentTask}
            formatTime={(seconds) => {
              const mins = Math.floor(seconds / 60);
              const secs = seconds % 60;
              return `${mins.toString().padStart(2, '0')}:${secs
                .toString()
                .padStart(2, '0')}`;
            }}
            isActive={isActive}
            toggle={toggle}
            reset={reset}
            skip={skip}
            totalSessionTime={
              isWorkTime
                ? workTime
                : (completedPomodoros + 1) % longBreakInterval === 0
                ? longBreakTime
                : shortBreakTime
            }
          />

          <TaskList
            tasks={tasks}
            setCurrentTask={setCurrentTask}
            deleteTodo={deleteTodo}
            subjects={subjects}
            onToggleAddTodo={() => setShowAddTodoForm(!showAddTodoForm)}
            showAddTodoForm={showAddTodoForm}
          />
        </div>
      </main>

      {/* Add ToDo Form */}
      {showAddTodoForm && (
        <div className='fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full'>
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
        <div className='fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full'>
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
          message={
            isWorkTime ? 'Pomodoro session completed!' : 'Break finished!'
          }
          onClose={() => setShowNotification(false)}
        />
      )}

      {/* Alarm Sound */}
      <audio
        ref={alarmRef}
        src='/alarm.mp3'
        preload='auto'
      />
    </div>
  );
}
