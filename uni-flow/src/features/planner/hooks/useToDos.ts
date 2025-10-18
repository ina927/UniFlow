import { useState, useEffect } from "react";
import { useUserId } from "@/shared";
import { getToDos, getPendings, getCompletes, getInProgress } from "../apis";
import { ToDoEntity } from "@/entities/todos/entities";

export const useToDos = () => {

    const userId = useUserId();
    if (!userId) throw new Error ("User Id not found");

    const [events, setEvents] = useState<ToDoEntity[]>([]);
    const [currentEvent, setCurrentEvents] = useState(null);
    const [pendings, setPendings] = useState<ToDoEntity[]>([]);
    const [inProgress, setInProgress] = useState<ToDoEntity[]>([]);
    const [completes, setCompletes] = useState<ToDoEntity[]>([]);
    const [newTodo, setNewTodo] = useState({
        userId: userId,
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
            const response = await getToDos();

            if (!response) {
            throw new Error("Failed to fetch tasks");
            }
            setEvents(response);

            setPendings(await getPendings(response));
            setInProgress(await getInProgress(response));
            setCompletes(await getCompletes(response));

        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
        };

        fetchTasks();
    }, []);

    const deleteTodo = async (eventId: string) => {
        try {
        const response = await deleteTodo(eventId);

        const refresh = await getToDos();
        if (!refresh) throw new Error("Delete failed");
        setEvents(refresh);

        } catch (error) {
        console.error("Error deleting events:", error);
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
            taskStatus: newTodo.taskStatus || "PENDING",
        };

        const response = await fetch("/api/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newToDo: todoWithDates }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to add events");
        }

        // Append the new todo
        setEvents((prev) => [...prev, data]);
        } catch (error) {
        console.error("Error adding events:", error);
        }
    };

    return { events, setEvents, currentEvent, setCurrentEvents, pendings, inProgress, completes, deleteTodo, addTodo, newTodo, setNewTodo };
};
