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

        // API returns array directly
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const deleteTodo = async (taskId) => {
    try {
      const response = await fetch(`/api/todos`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId }),
      });
      if (!response.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const addTodo = async () => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newToDo: newTodo }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error("Failed to add task");
      setTasks((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return { tasks, setTasks, currentTask, setCurrentTask, deleteTodo, addTodo, newTodo, setNewTodo };
};
