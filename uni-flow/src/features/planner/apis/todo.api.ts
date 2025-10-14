// library
import { ToDoEntity, ToDoVital } from "@/entities/todos/entities";
import { ToDoStatus } from "@/entities/enums";
import { useUserId } from "@/shared/stores";

import Axios from "axios";

// Function reports
export async function getToDos(): Promise<ToDoEntity[]>{
    
        const userId = useUserId();
        const allItems = await fetch('/api/todos', {
            headers: {
                userId: userId ?? "",
            }
        })

        if (!allItems.ok) throw new Error('Failed to fetch to-dos')
        
        const fetchEvents = await allItems.json();
        return fetchEvents;
    
}

export async function getToDosByFilter(subjectId: string): Promise<ToDoEntity[]>{
    const userId = useUserId();
    const allItems = await fetch('/api/todos', {
        headers: {
            userId: userId ?? "",
        }
    })

    if (!allItems.ok) throw new Error('Failed to fetch to-dos');

    const fetchEvents = await allItems.json();
    const filteredEvents = fetchEvents.filter((event: ToDoEntity) => {
        event.subjectId === subjectId
    });
    return filteredEvents;
}

// filtering function
export async function getPendings(events: ToDoEntity[]): Promise<ToDoEntity[]>{
    return (events.filter((event: {status: ToDoStatus;}) => event.status === ToDoStatus.PENDING))
}

export async function getInProgress(events: ToDoEntity[]): Promise<ToDoEntity[]>{
    return (events.filter((event: {status: ToDoStatus;}) => event.status === ToDoStatus.IN_PROGRESS))
}

export async function getCompletes(events: ToDoEntity[]): Promise<ToDoEntity[]>{
    return (events.filter((event: {status: ToDoStatus;}) => event.status === ToDoStatus.DONE))
}

//posting
export async function postEvents(event: ToDoVital): Promise<void>{
        // restructuring
        const newToDo = {
            userId: useUserId(),
            subjectId: event.subjectId,
            assessmentId: event.assessmentId,
            title: event.title,
            content: event.description,
            startDate: event.startDate,
            endDate: event.endDate,
            taskStatus: ToDoStatus.PENDING // default status
        }
        
        const res = await Axios.post('/api/todos', {newToDo})
        console.log(res);
}

export async function statusInProgress(event: ToDoEntity){
    const updated = { ...event, status: ToDoStatus.IN_PROGRESS };
        await Axios.put(`/api/todos/${event.id}`, {
            status: ToDoStatus.IN_PROGRESS
        });
}

export async function statusDone(event: ToDoEntity){
    const updated = { ...event, status: ToDoStatus.DONE };
        await Axios.put(`/api/todos/${event.id}`, {
            status: ToDoStatus.DONE
    });
}

export async function deleteToDo(event: ToDoEntity){
    if (!event) return;
    await Axios.delete(`/api/todos/${event.id}`);
}

export async function updateToDo(event: ToDoEntity){
    if (!event) return;
    await Axios.put(`/api/todos/${event.id}`, {
        title: event.title,
        description: event.description,
        subjectId: event.subjectId,
        startDate: event.startDate,
        endDate: event.endDate,
    });
}