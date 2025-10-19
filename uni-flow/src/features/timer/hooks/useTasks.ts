import { useEffect, useState } from 'react';

import { useAcademicStore, useAuthStore } from '@/shared/stores';
import type { Task } from '@/features/timer/ui/TaskList';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
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

  //  Get logged-in user info first
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/me', {
          credentials: 'include', 
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

  //  Fetch tasks after userId is known
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

        if (!Array.isArray(data)) {
          console.error('/api/todos returned unexpected payload', data);
          setTasks([]);
          return;
        }

        const inProgressTasks = (data as Task[]).filter(
          (task) => task.taskStatus !== 'DONE'
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


      const refreshedHeaders = new Headers();
      if (userId != null) refreshedHeaders.append('user-id', userId);
      if (academicCourseId != null)
        refreshedHeaders.append('academic-course-id', academicCourseId);

      const refreshed = await fetch('/api/todos', {
        credentials: 'include',
        cache: 'no-store',
        headers: refreshedHeaders,
      });

      const data = await refreshed.json();
      if (!Array.isArray(data)) {
        console.error('Unexpected /api/todos refresh response', data);
        return;
      }

      const inProgressTasks = (data as Task[]).filter(
        (task) => task.taskStatus !== 'DONE'
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
        userId, 
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
    userId, 
  };
};
