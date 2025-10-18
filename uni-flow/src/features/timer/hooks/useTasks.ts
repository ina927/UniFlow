import { useEffect, useState } from 'react';

import { useAcademicStore, useAuthStore } from '@/shared/stores';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTodo, setNewTodo] = useState({
    subjectId: '',
    assessmentId: '',
    title: '',
    content: '',
    endDate: '',
    taskStatus: 'IN_PROGRESS',
  });

  const { userId, setUserId } = useAuthStore();
  const { academicCourseId } = useAcademicStore();

  // ✅ Get logged-in user info first
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/me', {
          credentials: 'include', // ensure cookies/session are sent
          cache: 'no-store',
        });

        if (res.status === 401) {
          console.warn('User not logged in');
          setUserId('');
          return;
        }

        const data = await res.json();
        setUserId(data.user?.id || '');
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    fetchUser();
  }, []);

  // ✅ Fetch tasks after userId is known
  useEffect(() => {
    if (!userId || !academicCourseId) return;

    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/todos', {
          credentials: 'include',
          cache: 'no-store',
          headers: {
            'user-id': userId,
            'academic-course-id': academicCourseId,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const inProgressTasks = data.filter(
          (task: any) => task.taskStatus !== 'DONE'
        );
        setTasks(inProgressTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [userId, academicCourseId]);

  const deleteTodo = async (taskId: string) => {
    try {
      const response = await fetch(`/api/todos/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete task');

      // Refresh task list
      const refreshed = await fetch('/api/todos', {
        credentials: 'include',
        cache: 'no-store',
      });
      const data = await refreshed.json();
      const inProgressTasks = data.filter(
        (task: any) => task.taskStatus !== 'DONE'
      );
      setTasks(inProgressTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const addTodo = async () => {
    if (!userId || !academicCourseId) {
      console.warn('Cannot add task — user not logged in');
      return;
    }

    try {
      const formattedEndDate = newTodo.endDate
        ? new Date(newTodo.endDate).toISOString()
        : undefined;

      const safeSubjectId =
        newTodo.subjectId && newTodo.subjectId.trim() !== ''
          ? newTodo.subjectId
          : null;

      const todoWithDates = {
        userId, // ✅ use the logged-in user
        subjectId: safeSubjectId,
        assessmentId: newTodo.assessmentId || null,
        title: newTodo.title.trim(),
        content: newTodo.content.trim(),
        startDate: new Date().toISOString(),
        endDate: formattedEndDate,
        taskStatus: newTodo.taskStatus || 'IN_PROGRESS',
      };

      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': userId,
          'academic-course-id': academicCourseId,
        },
        credentials: 'include',
        body: JSON.stringify({ newToDo: todoWithDates }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add task');
      }

      setTasks((prev) => [...prev, data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return {
    tasks,
    setTasks,
    currentTask,
    setCurrentTask,
    deleteTodo,
    addTodo,
    newTodo,
    setNewTodo,
    userId, // optional: expose if you need it
  };
};
