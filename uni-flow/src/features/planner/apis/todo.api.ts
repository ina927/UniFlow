// library
import { ToDoEntity, ToDoVital } from "@/entities/todos/entities";
import { ToDoStatus } from "@/entities/enums";

import Axios from "axios";

// Function reports
export async function getToDos(userId: string): Promise<ToDoEntity[]>{
        const allItems = await fetch('/api/todos', {
            headers: {
                userId: "83482f49-8367-48d1-93f0-e98f01010f0f",
            }
        })

        // if (!allItems.ok) throw new Error('Failed to fetch to-dos')
        
        const fetchEvents = await allItems.json();
        return fetchEvents;
    
}

export async function getToDosByFilter(subjectId: string, userId: string): Promise<ToDoEntity[]>{

    const allItems = await fetch('/api/todos', {
        headers: {
            userId: userId,
            "subjectId": subjectId
        }
    })

    // if (!allItems.ok) {throw new Error('Failed to fetch to-dos')};

    const fetchEvents = await allItems.json();

    console.log("fetched:" + fetchEvents)

    const filteredEvents = fetchEvents.filter((event: {subjectId: string}) => {
        return event.subjectId === subjectId
        console.log("my subId: " + event.subjectId);
        console.log("their sub id" + subjectId)
    });

    console.log("filtered: " +filteredEvents);
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
export async function postEvents(userId: string, event: ToDoVital): Promise<void>{
        // restructuring
        const newToDo = {
            userId: userId,
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
    if (!event) {console.log("update failed"); return};
    await Axios.put(`/api/todos/${event.id}`, {
        title: event.title,
        description: event.description,
        subjectId: event.subjectId,
        startDate: event.startDate,
        endDate: event.endDate,
    });
}