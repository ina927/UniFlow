"use client";

// React import
import {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { DateSelectArg, EventApi, EventClickArg, formatDate } from "@fullcalendar/core/index.js";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Link from "next/link";

// database import
import Axios from "axios";
import { ToDoStatus } from "@/entities/enums";


export default function Calendar(){

    // for event control
    const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    // for database control (tags in form is to opt for the subject id)
    const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null); // this is the considered the start date
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [newEventTitle, setNewEventTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [taskStatus, setTaskStatus] = useState<string>("");

    // click handler
    useEffect(() => {
        if (typeof window !== "undefined"){
            const savedEvents = localStorage.getItem("events");
            if (savedEvents){
                setCurrentEvents(JSON.parse(savedEvents));
            }
        }
    }, []); //open json file

    useEffect(() => {
        if (typeof window !== "undefined"){
            localStorage.setItem("events", JSON.stringify(currentEvents));
        }
    }, [currentEvents]); //overwrite

    const handleDateClick = (selected: DateSelectArg) => {
        setSelectedDate(selected);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setNewEventTitle("");
        setContent("");
        setEndDate(null);
    };

    const handleEventClick = (selected: EventClickArg) => {
        if (
            window.confirm(`Delete the event "${selected.event.title}" from your calendar?`)
        ) {
            selected.event.remove();
        }
    }

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newEventTitle && selectedDate){
            const calendarApi = selectedDate.view.calendar;
            calendarApi.unselect();
        
        // this is for calendar view only
        const newEvent = {
            id: `${selectedDate?.start.toISOString()}-${newEventTitle}`,
            title: newEventTitle,
            start: selectedDate?.start,
            end: selectedDate?.end,
            allDat: selectedDate?.allDay,
        };

        // this is for the database
        
        const newToDo = {
            userId: '68ad41c7486238ade8bb2f2d',
            subjectId: null,
            assessmentId: null,
            title: newEventTitle,
            content: content,
            startDate: selectedDate?.start,
            endDate: endDate,
            taskStatus: ToDoStatus.PENDING
        }

        calendarApi.addEvent(newEvent);
        const response = await Axios.post('/api/todos', {newToDo})
        handleCloseDialog();
    }};

    return (
    <div className="studyPlanner" style={{marginTop: "3rem", marginLeft: "6rem", overflow: "hidden"}}>
        <div className="title" style={{display: "flex", flexDirection: "row", width: "100vw"}}>
            <h1 style={{fontSize: "2rem", fontWeight: "bold"}}>User&#39;s Study Planner</h1>
            <button style={{float: "right", marginLeft: "50vw", background: "var(--background-prime)", color: "var(--background)", paddingLeft:"1vw", paddingRight: "1vw"}}>Select Filter</button>
            <Link href="../planner" style={{float: "right", marginLeft: "2vw", background: "var(--background-prime)", color: "var(--background)", paddingLeft:"1vw", paddingRight: "1vw", paddingTop:"0.8vw"}}>List View</Link>
        </div>
        <br />

        <>
        <div className="flex px-10 justify-start items-start gap-8" style={{display:"flex", flexDirection: "row", width: "100vw", marginLeft: "-3vw"}}>
            <div className="w-3/12" style={{width: "20vw"}}>
                <div className="py-10 text-2xl font-extrabold px-7">
                    Upcoming Events
                </div>
                <ul className="space-y-4">
                    {currentEvents.length <= 0 && (
                        <div className="italic text-center text-gray-400">
                            Nothing in Here Yet..
                        </div>
                    )}
                    {currentEvents.length > 0 && currentEvents.map((event:EventApi) => (
                        <li className="border border-gray-200 shadow px-4 py-2 rounded-md text-blue-800" key={event.id}>
                            {event.title}
                            <br />
                            <label className="text-slate-950">
                                {formatDate(event.start!, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                })}
                            </label>

                        </li>
                    ))}
                </ul>
            </div>
            {/* calendar part */}
            <div className="w-9/12 mt-8" style={{width: "65vw"}}>
                <FullCalendar height={"75vh"} plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} headerToolbar={{left: "prev,next today", center: "title", right: "dayGridMonth, timeGridWeek, timeGridDay"}} initialView="dayGridMonth" selectable={true} editable={true} selectMirror={true} dayMaxEvents={true} select={handleDateClick}
                eventClick={handleEventClick}
                
                eventsSet={(events) => setCurrentEvents(events)}
                initialEvents={typeof window !== "undefined" ? JSON.parse(localStorage.getItem("events") || "[]") : []}
                />
            </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <br />
                <DialogHeader>
                    <DialogTitle style={{marginLeft: "1vw"}}>
                        Add New Task
                    </DialogTitle>
                </DialogHeader>
                <form className="space-x-5 mb-4" onSubmit={handleAddEvent} style={{display: "flex",flexDirection: "column"}}>
                    <input type="text" placeholder="NEW TASK" value={newEventTitle} onChange={(event) => setNewEventTitle(event.target.value)} required style={{borderBottom: "solid 3px gray", fontWeight: "bold", fontSize: "1.5rem", marginLeft:"0.7vw", opacity: 0.6, width: "97%"}} className="p-1 text-lg"/>

                    <textarea placeholder="Description(optional) (150 characters max)" className="p-3" style={{height: "10vh", wordWrap: "break-word", textWrap: "balance"}} maxLength={150} onChange={(e) => {
                        setContent(e.target.value)
                    }}/>
                    <div className="due-date" style={{display: "flex", flexDirection: "row"}}>
                        <label style={{marginLeft: "0.9vw", paddingRight: "1.5vw"}}>Due Date: </label>
                        <input type="date" name="deadline" required onChange={(e) => {
                            const date = e.target.value;
                            const newDate = new Date(date)
                            setEndDate(newDate)
                        }}/>
                    </div>
                    <div className="tags" style={{display: "flex", flexDirection: "row"}}>
                        <label style={{marginLeft: "0.9vw", paddingRight: "1.5vw"}}>Tags: </label>
                        <input type="text" name="deadline" /> {/*placeholder for now*/}
                    </div>
                    <hr style={{width: "93%", marginLeft: "1vw", height: "1px", background: "black", opacity: 0.8}}/>
                    {/* <div className="to-do-table" style={{paddingTop: "1vh", display: "flex", flexDirection: "column"}}> */}
                    {/* <label style={{marginLeft:"0.9vw", fontSize: "1.2rem", fontWeight: "bold"}}>To-do</label>
                        <ul style={{marginLeft:"1vw", opacity: 0.6}}>
                            <li>
                                <input type="checkbox" /> 
                                <label style={{paddingLeft: "1vw"}}>To-do task 1</label>
                            </li>
                        </ul>
                        <br />
                        <textarea name="to-do" placeholder="New to-do..." style={{marginLeft:"1vw", opacity: 0.6, width: "97%", borderBottom: "solid 3px gray"}}></textarea>
                        <input type="button" value="+" className="bg-green-500 text-white p-3 mt-5 rounded-md" style={{marginLeft: "1vw", marginTop: "1vh", background: "var(--background-prime)"}} />
                    </div> */}
                    {/* <br />
                    <hr style={{width: "93%", marginLeft: "1vw", height: "1px", background: "black", opacity: 0.8}}/> */}
                    <button className="text-white p-3 mt-5 rounded-md" style={{width: "92%", color: "var(--foreground)", background: "(var(--background-prime)", border: "solid 1px var(--background-prime)", marginLeft: "1vw"}} type="submit">Save</button>
                </form>
            </DialogContent>
        </Dialog>
        </>
    </div>

    )
}