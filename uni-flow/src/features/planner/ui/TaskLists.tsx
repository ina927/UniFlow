'use client';

import { useEffect, useState } from 'react';

import { ToDoEntity } from '@/entities/todos/entities';
import styles from './TaskLists.module.css';

// service import
import {
  deleteToDo,
  getCompletes,
  getInProgress,
  getPendings,
  getToDos,
  getToDosByFilter,
  statusDone,
  statusInProgress,
} from '@/features/planner/apis/todo.api';
import { AddToDoForm, EditToDoForm } from '@/features/planner/ui';

// type setup
type taskListsProps = {
  academicCourseId: string;
  filterBySubjectId?: string | null;
};

// export function
export const TaskLists = ({
  academicCourseId,
  filterBySubjectId,
}: taskListsProps) => {
  // list state
  const [events, setEvents] = useState<ToDoEntity[]>([]);
  const [pendings, setPendings] = useState<ToDoEntity[]>([]);
  const [inProgress, setInProgress] = useState<ToDoEntity[]>([]);
  const [completed, setCompleted] = useState<ToDoEntity[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string>('');

  const [selectedEvent, setSelectedEvent] = useState<ToDoEntity>();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  // for trigger
  const [isEditDialogue, setIsEditDialogue] = useState<boolean>(false);
  const [isAddDialogue, setIsAddDialogue] = useState<boolean>(false);

  // use handler + refresh rate

  const refresh = async () => {
    // filter check

    let events;
    events = await getToDos();

    if (filterBySubjectId?.trim() !== '' && filterBySubjectId) {
      const subId = filterBySubjectId;
      events = await getToDosByFilter(subId);
    }

    setEvents(events);

    console.log(events);

    // filtering
    const fetchedPen = await getPendings(events);
    if (fetchedPen) {
      setPendings(fetchedPen);
    }

    const fetchedInProg = await getInProgress(events);
    if (fetchedInProg) {
      setInProgress(fetchedInProg);
    }

    const fetchedComplete = await getCompletes(events);
    if (fetchedComplete) {
      setCompleted(fetchedComplete);
    }
  };

  useEffect(() => {
    const listings = async () => {
      const events = await getToDos();
      setEvents(events ?? []);
    };
    listings();
  }, []);

  useEffect(() => {
    refresh();
  }, [events, filterBySubjectId]);

  const handleEditButton = async (event: ToDoEntity) => {
    setSelectedEvent(event);
    setIsEditDialogue(true);
  };

  const handleCloseEdit = () => {
    setIsEditDialogue(false);
    setSelectedEvent(undefined);
    refresh();
  };

  const handleAddButton = () => {
    setIsAddDialogue(true);
  };

  const handleCloseAdd = () => {
    setIsAddDialogue(false);
    refresh();
  };

  return (
    <div className={styles.todoList}>
      <div
        className={styles.list}
        id='planned'
      >
        <div className={styles.listHeader}>
          <div className={styles.logo}>
            <h1 className={styles.symbol}>!</h1>
          </div>
          <h1 className={'text-large-title-bold ' + ' ' + styles.todoListTitle}>
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
            {pendings.length <= 0 && (
              <div
                className='italic text-center text-gray-400'
                style={{ marginTop: '2vh' }}
              >
                Nothing in Here Yet..
              </div>
            )}
            {pendings.length > 0 &&
              pendings.map((event: ToDoEntity) => (
                <li key={'plannner-' + pendings.indexOf(event)}>
                  <div className={styles.todoCard}>
                    <div
                      className={
                        'text-body1-semibold' + ' ' + styles.todoCardItem
                      }
                    >
                      <h2 className={styles.toDoItemTitle}>
                        {pendings.indexOf(event) + 1}
                      </h2>
                      <h2 className={styles.toDoItemTitle}>|</h2>
                      <h2>{event.title}</h2>
                    </div>
                    <h3 className={'text-body1' + ' ' + styles.deadlines}>
                      Deadline: {event.endDate.toString().substring(0, 10)}
                    </h3>
                    <div>
                      <button
                        onClick={() => {
                          statusInProgress(event);
                          refresh();
                        }}
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
          <h1 className={'text-large-title-bold ' + ' ' + styles.todoListTitle}>
            In-progress
          </h1>
        </div>
        <br />
        <div className={styles.todoList2}>
          <ul className={styles.lists}>
            {inProgress.length <= 0 && (
              <div className='italic text-center text-gray-400'>
                Nothing in Here Yet..
              </div>
            )}
            {inProgress.length > 0 &&
              inProgress.map((event: ToDoEntity) => (
                <li key={'plannner-' + inProgress.indexOf(event)}>
                  <div className={styles.todoCard}>
                    <div
                      className={
                        'text-body1-semibold' + ' ' + styles.todoCardItem
                      }
                    >
                      <h2 className={styles.toDoItemTitle}>
                        {inProgress.indexOf(event) + 1}
                      </h2>
                      <h2 className={styles.toDoItemTitle}>|</h2>
                      <h2>{event.title}</h2>
                    </div>
                    <h3 className={'text-body1' + ' ' + styles.deadlines}>
                      Deadline: {event.endDate.toString().substring(0, 10)}
                    </h3>
                    <div>
                      <button
                        onClick={() => statusDone(event)}
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
          <h1 className={'text-large-title-bold ' + ' ' + styles.todoListTitle}>
            Completed
          </h1>
        </div>
        <br />
        <div className={styles.todoList2}>
          <ul className={styles.lists}>
            {completed.length <= 0 && (
              <div className='italic text-center text-gray-400'>
                Nothing in Here Yet..
              </div>
            )}
            {completed.length > 0 &&
              completed.map((event: ToDoEntity) => (
                <li key={'plannner-' + completed.indexOf(event)}>
                  <div className={styles.todoCard}>
                    <div
                      className={
                        'text-body1-semibold' + ' ' + styles.todoCardItem
                      }
                    >
                      <h2 className={styles.toDoItemTitle}>
                        {completed.indexOf(event) + 1}
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

      {/* Edit component */}
      {selectedEvent && (
        <EditToDoForm
          academicCourseId={academicCourseId}
          event={selectedEvent}
          isOpen={isEditDialogue}
          onClose={handleCloseEdit}
        />
      )}

      {/* Add component */}
      {
        <AddToDoForm
          academicCourseId={academicCourseId}
          isOpen={isAddDialogue}
          onClose={handleCloseAdd}
        />
      }
    </div>
  );
};
