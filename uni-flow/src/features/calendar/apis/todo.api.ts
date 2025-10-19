// library
import { ToDoEntity, ToDoVital } from '@/entities/todos/entities';
import { ToDoStatus } from '@/entities/todos/enums';
import { EventApi, EventClickArg, EventInput } from "@fullcalendar/core/index.js"

import axios from 'axios';

const baseApi = '/api';
const getUserId = () =>
  (typeof window !== 'undefined' ? localStorage.getItem('user-id') : '') ?? '';

// Function reports
export async function getToDos(): Promise<ToDoEntity[]>  {
  const allItems = await fetch(`${baseApi}/todos`, {
    headers: {
      'user-id': getUserId(),
    },
  });

  if (!allItems.ok) throw new Error('Failed to fetch to-dos');

  const fetchEvents = await allItems.json();
  return fetchEvents;
}

export async function getToDosByFilter(
  subjectId: string
): Promise<ToDoEntity[]> {
  const allItems = await fetch(`${baseApi}/todos`, {
    headers: {
      'user-id': getUserId(),
    },
  });

  if (!allItems.ok) throw new Error('Failed to fetch to-dos');

  const fetchEvents = await allItems.json();
  const filteredEvents = fetchEvents.filter((event: ToDoEntity) => {
    return event.subjectId === subjectId;
  });
  return filteredEvents;
}

export async function getToDosById(id: string): Promise<ToDoEntity>{
  if (!id) throw new Error("Id not found");

  const event = await fetch(`${baseApi}/todos`, {
    headers: {
      'user-id': getUserId(),
    }
  })

  const allEvents = await event.json()
  const expectedEvent = allEvents.find((event: ToDoEntity) => {
    console.log("their id " + event.id);
    console.log("My id: " + id);
    return event.id === id;
  })

  console.log("I am expecting" + expectedEvent)
  return expectedEvent;

}

//posting
export async function postEvents(event: ToDoEntity): Promise<void> {
  const assessmentId = event.assessmentId?.trim() || null;

  // restructuring
  const newToDo = {
    userId: getUserId(),
    subjectId: event.subjectId,
    assessmentId: assessmentId,
    title: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    taskStatus: ToDoStatus.PENDING, // default status
  };

  const res = await axios.post(`${baseApi}/todos`, { newToDo });
  console.log(res);
}

export async function deleteToDo(event: ToDoEntity) {
  if (!event) return;
  await axios.delete(`${baseApi}/todos/${event.id}`, {
    headers: {
      'user-id': getUserId(),
    },
  });
}

export async function updateToDo(event: ToDoEntity) {
  if (!event) return;
  await axios.put(
    `${baseApi}/todos/${event.id}`,
    {
      title: event.title,
      description: event.description,
      subjectId: event.subjectId,
      startDate: event.startDate,
      endDate: event.endDate,
    },
    {
      headers: {
        'user-id': getUserId(),
      },
    }
  );
}
