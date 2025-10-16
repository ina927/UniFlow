'use client';

import Axios from 'axios';
import { useEffect, useState } from 'react';

// database import
import { ToDoStatus } from '@/entities/enums';
import { ToDoEntity } from '@/entities/todos/entities';
import {
  AddToDoForm,
  EditToDoForm,
  PlannerHeader,
} from '@/features/planner/ui';
import { useAcademicStore, useAuthStore } from '@/shared/stores';
import styles from './page.module.css';

// React import

export default function StudyPlanner() {
  const { userId } = useAuthStore();
  const { academicCourseId, setAcademicCourseId } = useAcademicStore();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState<boolean>(false);

  // for database control (tags in form is to opt for the subject id)
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [newEventTitle, setNewEventTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [events, setFetchEvent] = useState<ToDoEntity[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<ToDoEntity>();
  const [allFilter, setAllFilter] = useState<string[]>([]);
  const [filteredEvent, setFilteredEvent] = useState<ToDoEntity[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(''); // filter

  const [pendingEvent, setPendingEvent] = useState<ToDoEntity[]>([]);
  const [inProgressEvent, setInProgressEvent] = useState<ToDoEntity[]>([]);
  const [completedEvent, setCompletedEvent] = useState<ToDoEntity[]>([]);

  const baseApi = process.env.NEXT_PUBLIC_API_BASE_URL;

  // click handler
  useEffect(() => {
    const fetchUser = async () => {
      // const userResponse = await fetch(`http://localhost:3000/api/users/${userId}`);
      // const userData = await userResponse.json();
      setAcademicCourseId(academicCourseId); // hard code
    };
    const fetchToDo = async () => {
      setNewEventTitle('');
      setContent('');
      setEndDate(null);
      getAllFilter();
      const response = await fetch(`${baseApi}/todos`, {
        headers: {
          userId: userId!,
        },
      });

      const fetchEvents = await response.json();
      setFetchEvent(fetchEvents);

      // filtering
      const pendings = fetchEvents.filter(
        (event: { status: ToDoStatus }) => event.status === ToDoStatus.PENDING
      );
      setPendingEvent(pendings);

      const inProgress = fetchEvents.filter(
        (event: { status: ToDoStatus }) =>
          event.status === ToDoStatus.IN_PROGRESS
      );
      setInProgressEvent(inProgress);

      const dones = fetchEvents.filter(
        (event: { status: ToDoStatus }) => event.status === ToDoStatus.DONE
      );
      setCompletedEvent(dones);

      console.log(events);
    };
    fetchUser();
    fetchToDo();
  }, []); //open json file

  const refresh = () => {
    const fetchToDo = async () => {
      setNewEventTitle('');
      setContent('');
      setEndDate(null);
      const response = await fetch(`${baseApi}/todos`, {
        headers: {
          userId: userId!,
        },
      });

      let fetchEvents;

      if (selectedSubjectId) {
        fetchEvents = filteredEvent;
        console.log('here', fetchEvents);
      } else {
        const responseData = await response.json();
        fetchEvents = responseData;
      }

      setFetchEvent(fetchEvents);
      setFilteredEvent([]);

      // filtering
      const pendings = fetchEvents.filter(
        (event: { status: ToDoStatus }) => event.status === ToDoStatus.PENDING
      );
      setPendingEvent(pendings);

      const inProgress = fetchEvents.filter(
        (event: { status: ToDoStatus }) =>
          event.status === ToDoStatus.IN_PROGRESS
      );
      setInProgressEvent(inProgress);

      const dones = fetchEvents.filter(
        (event: { status: ToDoStatus }) => event.status === ToDoStatus.DONE
      );
      setCompletedEvent(dones);

      console.log(events);
    };
    fetchToDo();
  };

  const getAllFilter = async () => {
    const response = await fetch(`${baseApi}/subjects`);
    const allFilter = await response.json();

    setAllFilter(allFilter);
  };

  const statusChangePending = async (event: ToDoEntity) => {
    await Axios.put(`${baseApi}/todos/${event.id}`, {
      status: ToDoStatus.IN_PROGRESS,
    });
    refresh();
  };

  const statusChangeComplete = async (event: ToDoEntity) => {
    await Axios.put(`${baseApi}/todos/${event.id}`, {
      status: ToDoStatus.DONE,
    });
    refresh();
  };

  const deleteToDo = async (event: ToDoEntity) => {
    if (!event) return;
    await Axios.delete(`${baseApi}/todos/${event.id}`);
    refresh();
  };

  const handleEditButton = (event: ToDoEntity) => {
    setSelectedEvent(event);
    setIsDialogUpdateOpen(true);
    setEndDate(event.endDate);
    setContent(String(event.description));
    console.log(content);
    setNewEventTitle(String(event.title));
  };

  const handleAddButton = () => {
    setIsDialogOpen(true);
    setNewEventTitle('');
    setContent('');
    setEndDate(null);
  };

  const handleSubjectFilterChange = async (subjectId: string | null) => {
    console.log(subjectId);

    const response = await fetch(`${baseApi}/todos`, {
      headers: {
        userId: userId!,
      },
    });

    const freshEvents = await response.json();

    if (subjectId) {
      const filtered = freshEvents.filter(
        (event: ToDoEntity) => event.subjectId === subjectId
      );

      const pendings = filtered.filter(
        (e: ToDoEntity) => e.status === ToDoStatus.PENDING
      );
      const inProgress = filtered.filter(
        (e: ToDoEntity) => e.status === ToDoStatus.IN_PROGRESS
      );
      const completed = filtered.filter(
        (e: ToDoEntity) => e.status === ToDoStatus.DONE
      );

      console.log('Pen', pendings.length);
      console.log('Between', inProgress.length);
      console.log('Done', completed.length);

      setFetchEvent(freshEvents);
      setSelectedSubjectId(subjectId);
      setPendingEvent(pendings);
      setInProgressEvent(inProgress);
      setCompletedEvent(completed);
    } else {
      // Show ALL - no filter
      setFetchEvent(freshEvents);
      setSelectedSubjectId('');
      setPendingEvent(
        freshEvents.filter((e: ToDoEntity) => e.status === ToDoStatus.PENDING)
      );
      setInProgressEvent(
        freshEvents.filter(
          (e: ToDoEntity) => e.status === ToDoStatus.IN_PROGRESS
        )
      );
      setCompletedEvent(
        freshEvents.filter((e: ToDoEntity) => e.status === ToDoStatus.DONE)
      );
    }
  };

  return (
    <div
      className='studyPlanner'
      style={{ marginTop: '3rem', marginLeft: '4rem' }}
    >
      <PlannerHeader
        academicCourseId={academicCourseId!}
        onSubjectFilterChange={handleSubjectFilterChange}
      />
      <br />
      <h3 className='text-title3'>Last updated: version 1.0</h3>
      <br />
      <div className={styles.todoList}>
        <div
          className={styles.list}
          id='planned'
        >
          <div className={styles.listHeader}>
            <div className={styles.logo}>
              <h1 className={styles.symbol}>!</h1>
            </div>
            <h1
              className={'text-large-title-bold' + ' ' + styles.todoListTitle}
            >
              Planned
            </h1>
          </div>
          <div className={styles.createToDo}>
            <button
              id={styles.addToDo}
              className='text-body1'
              onClick={handleAddButton}
            >
              New +
            </button>
          </div>

          <div
            className={styles.todoList2}
            style={{ marginTop: '-5vw', height: '49vh' }}
          >
            <ul
              className={styles.lists}
              style={{ marginTop: '0vh' }}
            >
              {pendingEvent.length <= 0 && (
                <div
                  className='italic text-center text-gray-400'
                  style={{ marginTop: '2vh' }}
                >
                  Nothing in Here Yet..
                </div>
              )}
              {pendingEvent.length > 0 &&
                pendingEvent.map((event: ToDoEntity) => (
                  <li key={'plannner-' + pendingEvent.indexOf(event)}>
                    <div className={styles.todoCard}>
                      <div
                        className={
                          'text-body1-semibold' + ' ' + styles.todoCardItem
                        }
                      >
                        <h2 className={styles.toDoItemTitle}>
                          {pendingEvent.indexOf(event) + 1}
                        </h2>
                        <h2 className={styles.toDoItemTitle}>|</h2>
                        <h2>{event.title}</h2>
                      </div>
                      <h3 className={'text-body1' + ' ' + styles.deadlines}>
                        Deadline: {event.endDate.toString().substring(0, 10)}
                      </h3>
                      <div>
                        <button
                          onClick={() => statusChangePending(event)}
                          className={'text-body1' + ' ' + styles.status}
                        >
                          Start
                        </button>
                        <button
                          onClick={() => handleEditButton(event)}
                          className={'text-body1' + ' ' + styles.edit}
                        >
                          ✎
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div
          className={styles.list}
          id='in-progress'
          style={{ marginLeft: '3vw' }}
        >
          <div className={styles.listHeader}>
            <div className={styles.logo}>
              <h1 className={styles.symbol}>!</h1>
            </div>
            <h1
              className={'text-large-title-bold ' + ' ' + styles.todoListTitle}
            >
              In-progress
            </h1>
          </div>
          <br />
          <div className={styles.todoList2}>
            <ul className={styles.lists}>
              {inProgressEvent.length <= 0 && (
                <div className='italic text-center text-gray-400'>
                  Nothing in Here Yet..
                </div>
              )}
              {inProgressEvent.length > 0 &&
                inProgressEvent.map((event: ToDoEntity) => (
                  <li key={'plannner-' + inProgressEvent.indexOf(event)}>
                    <div className={styles.todoCard}>
                      <div
                        className={
                          'text-body1-semibold' + ' ' + styles.todoCardItem
                        }
                      >
                        <h2 className={styles.toDoItemTitle}>
                          {inProgressEvent.indexOf(event) + 1}
                        </h2>
                        <h2 className={styles.toDoItemTitle}>|</h2>
                        <h2>{event.title}</h2>
                      </div>
                      <h3 className={'text-body1' + ' ' + styles.deadlines}>
                        Deadline: {event.endDate.toString().substring(0, 10)}
                      </h3>
                      <div>
                        <button
                          onClick={() => statusChangeComplete(event)}
                          className={'text-body1' + ' ' + styles.status}
                        >
                          Finish
                        </button>
                        <button
                          onClick={() => handleEditButton(event)}
                          className={'text-body1' + ' ' + styles.edit}
                        >
                          ✎
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div
          className={styles.list}
          id='completed'
          style={{ marginLeft: '3vw' }}
        >
          <div className={styles.listHeader}>
            <div className={styles.logo}>
              <h1 className={styles.symbol}>!</h1>
            </div>
            <h1
              className={'text-large-title-bold' + ' ' + styles.todoListTitle}
            >
              Completed
            </h1>
          </div>
          <br />
          <div className={styles.todoList2}>
            <ul className={styles.lists}>
              {completedEvent.length <= 0 && (
                <div className='italic text-center text-gray-400'>
                  Nothing in Here Yet..
                </div>
              )}
              {completedEvent.length > 0 &&
                completedEvent.map((event: ToDoEntity) => (
                  <li key={'plannner-' + completedEvent.indexOf(event)}>
                    <div className={styles.todoCard}>
                      <div
                        className={
                          'text-body1-semibold' + ' ' + styles.todoCardItem
                        }
                      >
                        <h2 className={styles.toDoItemTitle}>
                          {completedEvent.indexOf(event) + 1}
                        </h2>
                        <h2 className={styles.toDoItemTitle}>|</h2>
                        <h2>{event.title}</h2>
                      </div>
                      <h3 className={'text-body1' + ' ' + styles.deadlines}>
                        Deadline: {event.endDate.toString().substring(0, 10)}
                      </h3>
                      <div>
                        <button
                          onClick={() => deleteToDo(event)}
                          className={'text-body1' + ' ' + styles.status}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      <AddToDoForm
        academicCourseId={academicCourseId!}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      <EditToDoForm
        academicCourseId={academicCourseId!}
        event={selectedEvent!}
        isOpen={isDialogUpdateOpen}
        onClose={() => setIsDialogUpdateOpen(false)}
      />
    </div>
  );
}
