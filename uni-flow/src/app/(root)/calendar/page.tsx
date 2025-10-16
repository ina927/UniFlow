'use client';

// React import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import {
  DateSelectArg,
  EventApi,
  EventClickArg,
  EventInput,
  formatDate,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// database import
import { ToDoEntity } from '@/entities/todos/entities/todo.entity';
import { ToDoStatus } from '@/entities/todos/enums';
import { Combobox } from '@/widgets/planner/SetFilterModal';
import Axios from 'axios';

export default function Calendar() {
  // for event control
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [currentEventsInput, setCurrentEventsInput] = useState<EventInput[]>(
    []
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState<boolean>(false);

  // for database control (tags in form is to opt for the subject id)
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null); // this is the considered the start date
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [newEventTitle, setNewEventTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<EventApi>();
  const [selectedEventId, setSelectedEventId] = useState<string>();
  const [selectedEventArg, setSelectedEventArg] = useState<EventClickArg>();
  const [academicCourseId, setAcademicCourseId] = useState<string>('');
  // const [taskStatus, setTaskStatus] = useState<string>("");

  const [filteredEvent, setFilteredEvent] = useState<EventApi[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(''); // filter
  const [subId, setSubId] = useState<string>('');

  // data dummy for now
  const userId = '68ad41c7486238ade8bb2f2d';
  const calendarRef = useRef<FullCalendar | null>(null);

  // click handler
  useEffect(() => {
    const fetchToDo = async () => {
      const response = await fetch('http://localhost:3000/api/todos', {
        headers: {
          userId: userId,
        },
      });

      console.log('calendar test');
      console.log(currentEvents);

      const fetchEvents = await response.json();

      const FormattedEvents: EventApi[] = fetchEvents.map((todo: any) => ({
        id: todo.id,
        title: todo.title,
        content: todo.description,
        start: new Date(todo.startDate),
        end: todo.endDate ? new Date(todo.endDate) : undefined,
        allDay: todo.allDay ?? false,
      }));

      const FormattedEventsInput: EventInput[] = fetchEvents.map(
        (todo: any) => ({
          id: String(todo.id),
          title: todo.title,
          content: todo.description,
          start: new Date(todo.startDate),
          end: todo.endDate ? new Date(todo.endDate) : undefined,
          allDay: todo.allDay ?? false,
        })
      );

      setCurrentEvents(FormattedEvents);
      setCurrentEventsInput(FormattedEventsInput);
      console.log(FormattedEvents);
      console.log('-----');
      console.log(currentEvents);
    };
    calendarRef.current?.getApi().removeAllEvents();
    fetchToDo();
  }, []); //open json file

  const refresh = () => {
    const fetchToDo = async () => {
      const response = await fetch('http://localhost:3000/api/todos', {
        headers: {
          userId: userId,
        },
      });

      console.log('calendar test');
      console.log(currentEvents);

      const fetchEvents = await response.json();

      const FormattedEvents: EventApi[] = fetchEvents.map((todo: any) => ({
        id: todo.id,
        title: todo.title,
        content: todo.description,
        subjectId: todo.subjectId,
        start: new Date(todo.startDate),
        end: todo.endDate ? new Date(todo.endDate) : undefined,
        allDay: todo.allDay ?? false,
      }));

      const FormattedEventsInput: EventInput[] = fetchEvents.map(
        (todo: any) => ({
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
        })
      );

      setCurrentEvents(FormattedEvents);
      setCurrentEventsInput(FormattedEventsInput);
      console.log(FormattedEvents);
      console.log('-----');
      console.log(currentEvents);
    };
    calendarRef.current?.getApi().removeAllEvents();
    fetchToDo();
  };
  // useEffect(() => {
  //     if (typeof window !== "undefined"){
  //         localStorage.setItem("events", JSON.stringify(currentEvents));
  //     }
  // }, [currentEvents]); //overwrite

  const deleteToDo = async (event: ToDoEntity) => {
    await Axios.delete(`/api/todos/${event.id}`);
    refresh();
  };

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle('');
    setContent('');
    setEndDate(null);
  };

  const handleEventClick = async (selected: EventClickArg) => {
    const event = selected.event;

    setSelectedEventArg(selected);
    setSelectedEvent(selected.event);
    setNewEventTitle(selected.event.title);
    setContent(selected.event.extendedProps.content || '');
    setSelectedEventId(event.id ?? null);
    setEndDate(selected.event.end || null);
    setIsDialogUpdateOpen(true);
    // setSelectedEventArg(selected);

    // const response = await fetch(`/api/todos/${selected.event.id}`, {
    //     headers: {
    //         userId: userId,
    //     }
    // })

    // const stringRes = await response.json()

    // setNewEventTitle(stringRes.title);
    // setContent(stringRes.description);
    // setEndDate(stringRes.endDate);

    // setIsDialogUpdateOpen(true);

    // if (
    //     window.confirm(`Delete the event "${selected.event.title}" from your calendar?`)
    // ) {

    //     selected.event.remove();
    //     // await Axios.delete(`/api/todos/${event.id}`);
    //     // refresh();
    // }
  };

  const updateDialog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventArg) return;

    console.log(selectedEventId);
    if (newEventTitle === '') {
      setNewEventTitle('New Task');
    }

    await Axios.put(`/api/todos/${selectedEventArg.event.id}`, {
      title: newEventTitle,
      description: content,
      endDate: endDate,
    });

    refresh();
    setIsDialogUpdateOpen(false);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEventArg) return;

    await Axios.delete(`/api/todos/${selectedEventArg.event.id}`);
    selectedEventArg.event.remove();
    refresh();
    setIsDialogUpdateOpen(false);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar;
      calendarApi.unselect();

      // // this is for calendar view only
      // const newEvent = {
      //     id: `${selectedDate?.start.toISOString()}-${newEventTitle}`,
      //     title: newEventTitle,
      //     content: content,
      //     start: selectedDate?.start,
      //     end: selectedDate?.end,
      //     allDat: selectedDate?.allDay,
      // };

      setEndDate(selectedDate.end);

      if (newEventTitle === '') {
        setNewEventTitle('New Task');
      }

      // this is for the database

      const newToDo = {
        userId: '83482f49-8367-48d1-93f0-e98f01010f0f',
        subjectId: '91bc3c52-fe3c-4df8-ad77-284c108730a6',
        assessmentId: null,
        title: newEventTitle,
        content: content,
        startDate: selectedDate?.start,
        endDate: selectedDate?.end,
        taskStatus: ToDoStatus.PENDING,
      };

      // calendarApi.addEvent(newEvent);
      const response = await Axios.post('/api/todos', { newToDo });
      console.log(response);
      refresh();
      handleCloseDialog();
    }
  };

  const setFilteredEvents = async (subjectId: string) => {
    const events = currentEvents;
    if (subjectId) {
      const filtered = currentEvents.filter(
        (event: EventApi) => event.extendedProps?.subjectId === subjectId
      );
      setFilteredEvent(filtered);
      refresh();
    } else {
      return;
    }
  };

  const handleSubjectFilterChange = async (subjectId: string) => {
    console.log(subjectId);

    const response = await fetch('http://localhost:3000/api/todos', {
      headers: {
        userId: userId,
      },
    });

    const freshEvents = await response.json();

    if (subjectId) {
      const filtered = freshEvents.filter(
        (event: ToDoEntity) => event.subjectId === subjectId
      );

      const FormattedEvents: EventApi[] = filtered.map((todo: any) => ({
        id: todo.id,
        title: todo.title,
        content: todo.description,
        subjectId: todo.subjectId,
        start: new Date(todo.startDate),
        end: todo.endDate ? new Date(todo.endDate) : undefined,
        allDay: todo.allDay ?? false,
      }));

      const FormattedEventsInput: EventInput[] = filtered.map((todo: any) => ({
        id: todo.id,
        title: todo.title,
        start: new Date(todo.startDate),
        end: todo.endDate ? new Date(todo.endDate) : undefined,
        allDay: todo.allDay ?? false,
        extendedProps: {
          subjectId: todo.subjectId,
          content: todo.description,
          status: todo.status,
        },
      }));

      setCurrentEvents(FormattedEvents);
      setCurrentEventsInput(FormattedEventsInput);
      setSelectedSubjectId(subjectId);
    } else {
      const FormattedEvents: EventApi[] = freshEvents.map((todo: any) => ({
        id: todo.id,
        title: todo.title,
        content: todo.description,
        subjectId: todo.subjectId,
        start: new Date(todo.startDate),
        end: todo.endDate ? new Date(todo.endDate) : undefined,
        allDay: todo.allDay ?? false,
      }));

      const FormattedEventsInput: EventInput[] = freshEvents.map(
        (todo: any) => ({
          id: todo.id,
          title: todo.title,
          start: new Date(todo.startDate),
          end: todo.endDate ? new Date(todo.endDate) : undefined,
          allDay: todo.allDay ?? false,
          extendedProps: {
            subjectId: todo.subjectId,
            content: todo.description,
            status: todo.status,
          },
        })
      );

      setCurrentEvents(FormattedEvents);
      setCurrentEventsInput(FormattedEventsInput);
      setSelectedSubjectId('');
    }
  };

  return (
    <div
      className='studyPlanner'
      style={{ marginTop: '3rem', marginLeft: '4rem', overflow: 'hidden' }}
    >
      <div
        className='title'
        style={{ display: 'flex', flexDirection: 'row' }}
      >
        <h1
          className='text-large-title-bold'
          style={{ width: '40vw' }}
        >
          User&#39;s Study Planner
        </h1>
        <Combobox
          academicCourseId={academicCourseId}
          onSubjectChange={handleSubjectFilterChange}
        />
        {/* <button style={{float: "right", marginLeft: "10vw", background: "var(--background-prime)", color: "var(--background)", paddingLeft:"1vw", paddingRight: "1vw", height: "5vh", width: "10vw"}} className="text-title3-bold">Select Filter</button> */}
        <Link
          href='../planner'
          style={{
            float: 'right',
            marginLeft: '0.5vw',
            background: 'var(--background-prime)',
            color: 'var(--background)',
            paddingLeft: '0.5vw',
            paddingRight: '0.5vw',
            paddingTop: '1vh',
            height: '5vh',
            width: '2.5vw',
            borderRadius: '1vw',
            textAlign: 'left',
          }}
          className='text-title3-bold'
        >
          📋
        </Link>
      </div>

      <>
        <div
          className='flex px-10 justify-start items-start gap-8'
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100vw',
            marginLeft: '-3vw',
          }}
        >
          <div
            className='w-3/12'
            style={{ width: '17vw', marginTop: '5vh', marginLeft: '0.5vw' }}
          >
            <div className='text-title1-bold'>Upcoming Events</div>
            <br />
            <br />
            <div
              style={{
                height: '55vh',
                overflow: 'scroll',
                overflowX: 'hidden',
              }}
            >
              <ul className='space-y-4'>
                {currentEvents.length <= 0 && (
                  <div className='italic text-center text-gray-400'>
                    Nothing in Here Yet..
                  </div>
                )}
                {currentEvents.length > 0 &&
                  currentEvents.map((event: EventApi) => (
                    <li
                      className='border border-gray-200 shadow px-4 py-2 rounded-md text-blue-800'
                      key={event.id}
                    >
                      {event.title}
                      <br />
                      <label className='text-slate-950'>
                        {formatDate(event.end!, {
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
              eventsSet={(events) => setCurrentEvents(events)}
              events={currentEventsInput}
            />
          </div>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        >
          <DialogContent>
            <br />
            <DialogHeader>
              <DialogTitle style={{ marginLeft: '1vw' }}>
                Add New Task
              </DialogTitle>
            </DialogHeader>
            <form
              className='space-x-5 mb-4'
              onSubmit={handleAddEvent}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <input
                type='text'
                placeholder='NEW TASK'
                value={newEventTitle}
                onChange={(event) => setNewEventTitle(event.target.value)}
                required
                style={{
                  borderBottom: 'solid 3px gray',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  marginLeft: '0.7vw',
                  opacity: 0.6,
                  width: '97%',
                }}
                className='p-1 text-lg'
              />

              <textarea
                placeholder='Description(optional) (150 characters max)'
                className='p-3'
                style={{
                  height: '10vh',
                  wordWrap: 'break-word',
                  textWrap: 'balance',
                }}
                maxLength={150}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />
              {/* <div className="due-date" style={{display: "flex", flexDirection: "row"}}>
                        <label style={{marginLeft: "0.9vw", paddingRight: "1.5vw"}}>Due Date: </label>
                        <input type="date" name="deadline" required onChange={(e) => {
                            const date = e.target.value;
                            const newDate = new Date(date)
                            setEndDate(newDate)
                        }}/>
                    </div> */}
              <div
                className='tags'
                style={{ display: 'flex', flexDirection: 'row' }}
              >
                <label style={{ marginLeft: '0.9vw', paddingRight: '1.5vw' }}>
                  Tags:{' '}
                </label>
                <input
                  type='text'
                  name='deadline'
                />{' '}
                {/*placeholder for now*/}
              </div>
              <hr
                style={{
                  width: '93%',
                  marginLeft: '1vw',
                  height: '1px',
                  background: 'black',
                  opacity: 0.8,
                }}
              />
              <button
                className='text-white p-3 mt-5 rounded-md'
                style={{
                  width: '92%',
                  color: 'var(--foreground)',
                  background: '(var(--background-prime)',
                  border: 'solid 1px var(--background-prime)',
                  marginLeft: '1vw',
                }}
                type='submit'
              >
                Save
              </button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isDialogUpdateOpen}
          onOpenChange={setIsDialogUpdateOpen}
        >
          <DialogContent>
            <br />
            <DialogHeader>
              <DialogTitle style={{ marginLeft: '1vw' }}>
                Update Task
              </DialogTitle>
            </DialogHeader>
            <form
              className='space-x-5 mb-4'
              style={{ display: 'flex', flexDirection: 'column' }}
              onSubmit={updateDialog}
            >
              <input
                type='text'
                placeholder='NEW TASK'
                value={newEventTitle}
                onChange={(event) => setNewEventTitle(event.target.value)}
                required
                style={{
                  borderBottom: 'solid 3px gray',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  marginLeft: '0.7vw',
                  opacity: 0.6,
                  width: '97%',
                }}
                className='p-1 text-lg'
              />

              <textarea
                placeholder='Description(optional) (150 characters max)'
                className='p-3'
                style={{
                  height: '10vh',
                  wordWrap: 'break-word',
                  textWrap: 'balance',
                }}
                maxLength={150}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />
              <div
                className='tags'
                style={{ display: 'flex', flexDirection: 'row' }}
              >
                <label style={{ marginLeft: '0.9vw', paddingRight: '1.5vw' }}>
                  Tags: currently unavailable
                </label>
                <input
                  type='text'
                  name='deadline'
                />{' '}
                {/*placeholder for now*/}
              </div>
              <hr
                style={{
                  width: '93%',
                  marginLeft: '1vw',
                  height: '1px',
                  background: 'black',
                  opacity: 0.8,
                }}
              />
              <button
                className='text-white p-3 mt-5 rounded-md'
                style={{
                  width: '92%',
                  color: 'var(--background-prime)',
                  background: '(var(--foreground)',
                  border: 'solid 1px var(--background-prime)',
                  marginLeft: '1vw',
                }}
                type='submit'
              >
                Save
              </button>
              <button
                className='text-white p-3 mt-5 rounded-md'
                style={{
                  width: '92%',
                  color: 'var(--background-prime)',
                  background: '(var(--foreground)',
                  border: 'solid 1px var(--background-prime)',
                  marginLeft: '1vw',
                }}
                onClick={handleDeleteEvent}
              >
                Delete
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </>
    </div>
    // https://www.youtube.com/watch?v=3CMgznBdl-M
  );
}
