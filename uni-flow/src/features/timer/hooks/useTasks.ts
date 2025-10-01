import { useState, useEffect } from "react";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTodo, setNewTodo] = useState({
    userId: "83482f49-8367-48d1-93f0-e98f01010f0f",
    subjectId: "",
    assessmentId: "",
    title: "",
    content: "",
    endDate: "",
    taskStatus: "IN_PROGRESS",
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

        // Only include tasks not marked as DONE
        const inProgressTasks = data.filter((task) => task.taskStatus !== "DONE");
        setTasks(inProgressTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const deleteTodo = async (taskId) => {
    try {
      const response = await fetch(`/api/todos/${taskId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");

      // Refetch tasks to ensure state is up-to-date
      const refreshed = await fetch("/api/todos");
      const data = await refreshed.json();
      const inProgressTasks = data.filter((task) => task.taskStatus !== "DONE");
      setTasks(inProgressTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const addTodo = async () => {
    try {
      const formattedEndDate = newTodo.endDate
        ? new Date(newTodo.endDate).toISOString()
        : undefined;

      const safeSubjectId =
        newTodo.subjectId && newTodo.subjectId.trim() !== "" ? newTodo.subjectId : null;

      const todoWithDates = {
        userId: newTodo.userId,
        subjectId: safeSubjectId,
        assessmentId: newTodo.assessmentId || null,
        title: newTodo.title.trim(),
        content: newTodo.content.trim(),
        startDate: new Date().toISOString(),
        endDate: formattedEndDate,
        taskStatus: newTodo.taskStatus || "IN_PROGRESS",
      };

      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newToDo: todoWithDates }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add task");
      }

      // Append the new todo
      setTasks((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return { tasks, setTasks, currentTask, setCurrentTask, deleteTodo, addTodo, newTodo, setNewTodo };
};
