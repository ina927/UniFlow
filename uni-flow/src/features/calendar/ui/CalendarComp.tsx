'use client';

// React import
import {
  DateSelectArg,
  EventApi,
  EventClickArg,
  EventInput,
  formatDate,
} from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useRef, useState } from 'react';

// database import
import { ToDoEntity } from '@/entities/todos';
import {
  getToDos,
  getToDosByFilter,
  getToDosById,
} from '@/features/calendar/apis/todo.api';
import { AddToDoForm, EditToDoForm } from '@/features/planner/ui';

import styles from './CalendarComp.module.css';

// type setup
type calendarCompProps = {
  academicCourseId: string;
  filterBySubjectId?: string | null;
};

// export functions
export const CalendarComp = ({
  academicCourseId,
  filterBySubjectId,
}: calendarCompProps) => {
  // list state
  const [events, setEvents] = useState<ToDoEntity[]>([]);
  const [calendar, setCalendar] = useState<EventApi[]>([]);

  const [selectedEvent, setSelectedEvent] = useState<EventApi>();
  const [selectedEventArg, setSelectedEventArg] = useState<EventClickArg>();
  const [selectedEventInput, setSelectedEventInput] = useState<EventInput[]>(
    []
  );
  const [selectedEventEntity, setSelectedEventEntity] = useState<ToDoEntity>();
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>();

  // for trigger
  const [isEditDialogue, setIsEditDialogue] = useState<boolean>(false);
  const [isAddDialogue, setIsAddDialogue] = useState<boolean>(false);

  // reference
  const calendarRef = useRef<FullCalendar | null>(null);

  // use handler + refresh rate

  const refresh = async () => {
    // filter check

    calendarRef.current?.getApi().removeAllEvents();

    let events;
    events = await getToDos();

    if (filterBySubjectId?.trim() !== '' && filterBySubjectId) {
      const subId = filterBySubjectId;
      events = await getToDosByFilter(subId);
    }

    setEvents(events);

    const FormattedEventsInput: EventInput[] = events.map((todo: any) => ({
      id: todo.id,
      title: todo.title,
      start: new Date(todo.startDate),
      end: todo.endDate ? new Date(todo.endDate) : undefined,
      allDay: todo.allDay ?? false,
      extendedProps: {
        // Put custom properties here
        subjectId: todo.subjectId,
        content: todo.description,
        status: todo.status,
      },
    }));

    console.log(events);

    setSelectedEventInput(FormattedEventsInput);
  };

  useEffect(() => {
    const listings = async () => {
      const events = await getToDos();
      setEvents(events);

      const FormattedEventsInput: EventInput[] = events.map((todo: any) => ({
        id: String(todo.id),
        title: todo.title,
        content: todo.description,
        start: new Date(todo.startDate),
        end: todo.endDate ? new Date(todo.endDate) : undefined,
        allDay: todo.allDay ?? false,
      }));

      setSelectedEventInput(FormattedEventsInput);
    };
    calendarRef.current?.getApi().removeAllEvents();
    listings();
  }, []);

  useEffect(() => {
    refresh();
  }, [filterBySubjectId]);

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setIsAddDialogue(true);
  };

  const handleEventClick = async (selected: EventClickArg) => {
    const event = selected.event;

    const expectedEvent = await getToDosById(event.id);
    console.log('Keys: ' + Object.keys(expectedEvent));

    setSelectedEventEntity(expectedEvent);
    setSelectedEventArg(selected);
    setSelectedEvent(selected.event);
    setSelectedEventId(event.id ?? null);
    setIsEditDialogue(true);
  };

  const handleCloseEdit = () => {
    setIsEditDialogue(false);
    setSelectedEvent(undefined);
    refresh();
  };

  const handleCloseAdd = () => {
    setIsAddDialogue(false);
    refresh();
  };

  return (
    <div
      className={
        'flex px-10 justify-start items-start gap-8' + ' ' + styles.container
      }
    >
      <div className={'w-3/12' + ' ' + styles.divListContainer}>
        <div className='text-title1-bold'>Upcoming Events</div>
        <br />
        <br />
        <div className={styles.divList}>
          <ul className='space-y-4'>
            {events.length <= 0 && (
              <div className='italic text-center text-gray-400'>
                Nothing in Here Yet..
              </div>
            )}
            {events.length > 0 &&
              events.map((event: ToDoEntity) => (
                <li
                  className='border border-gray-200 shadow px-4 py-2 rounded-md text-blue-800'
                  key={event.id}
                >
                  {event.title}
                  <br />
                  <label className='text-slate-950'>
                    {formatDate(event.endDate, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </label>
                </li>
              ))}
          </ul>
        </div>
      </div>
      {/* calendar part */}
      <div
        className='w-9/12 mt-8'
        style={{ width: '55vw' }}
      >
        <FullCalendar
          height={'75vh'}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth, timeGridWeek, timeGridDay',
          }}
          initialView='dayGridMonth'
          selectable={true}
          editable={true}
          selectMirror={true}
          dayMaxEvents={true}
          select={handleDateClick}
          eventClick={handleEventClick}
          // eventsSet={(events) => setEvents(events)}
          events={selectedEventInput}
        />
      </div>
      {/* Edit component */}
      {selectedEventEntity && (
        <EditToDoForm
          academicCourseId={academicCourseId}
          event={selectedEventEntity}
          isOpen={isEditDialogue}
          onClose={handleCloseEdit}
          refresh={refresh}
        />
      )}

      {/* Add component */}
      {
        <AddToDoForm
          academicCourseId={academicCourseId}
          isOpen={isAddDialogue}
          onClose={handleCloseAdd}
          refresh={refresh}
        />
      }
    </div>
  );
};
