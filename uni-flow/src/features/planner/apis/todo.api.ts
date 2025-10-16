// library
import { ToDoEntity, ToDoVital } from '@/entities/todos/entities';
import { ToDoStatus } from '@/entities/todos/enums';
import axios from 'axios';

const baseApi = process.env.NEXT_PUBLIC_API_BASE_URL;

const userId = localStorage.getItem('user-id')!;

// Function reports
export async function getToDos(): Promise<ToDoEntity[]> {
  const allItems = await fetch(`${baseApi}/todos`, {
    headers: {
      'user-id': userId,
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
      'user-id': userId,
    },
  });

  if (!allItems.ok) throw new Error('Failed to fetch to-dos');

  const fetchEvents = await allItems.json();
  const filteredEvents = fetchEvents.filter((event: ToDoEntity) => {
    event.subjectId === subjectId;
  });
  return filteredEvents;
}

// filtering function
export async function getPendings(events: ToDoEntity[]): Promise<ToDoEntity[]> {
  return events.filter(
    (event: { status: ToDoStatus }) => event.status === ToDoStatus.PENDING
  );
}

export async function getInProgress(
  events: ToDoEntity[]
): Promise<ToDoEntity[]> {
  return events.filter(
    (event: { status: ToDoStatus }) => event.status === ToDoStatus.IN_PROGRESS
  );
}

export async function getCompletes(
  events: ToDoEntity[]
): Promise<ToDoEntity[]> {
  return events.filter(
    (event: { status: ToDoStatus }) => event.status === ToDoStatus.DONE
  );
}

//posting
export async function postEvents(event: ToDoVital): Promise<void> {
  const assessmentId = event.assessmentId?.trim() || null;

  // restructuring
  const newToDo = {
    userId: userId,
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

export async function statusInProgress(event: ToDoEntity) {
  const updated = { ...event, status: ToDoStatus.IN_PROGRESS };
  await axios.put(
    `${baseApi}/todos/${event.id}`,
    {
      status: ToDoStatus.IN_PROGRESS,
    },
    {
      headers: {
        'user-id': userId,
      },
    }
  );
}

export async function statusDone(event: ToDoEntity) {
  const updated = { ...event, status: ToDoStatus.DONE };
  await axios.put(
    `${baseApi}/todos/${event.id}`,
    {
      status: ToDoStatus.DONE,
    },
    {
      headers: {
        'user-id': userId,
      },
    }
  );
}

export async function deleteToDo(event: ToDoEntity) {
  if (!event) return;
  await axios.delete(`${baseApi}/todos/${event.id}`, {
    headers: {
      'user-id': userId,
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
        'user-id': userId,
      },
    }
  );
}
