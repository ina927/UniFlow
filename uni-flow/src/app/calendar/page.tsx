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
import { DayGridView } from "@fullcalendar/daygrid/internal.js";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import Link from "next/link";

type ViewType = "Day" | "Week" | "Month";

export default function studyPlanner(){

    // for event control
    const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [newEventTitle, setNewEventTitle] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);

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
    };

    const handleEventClick = (selected: EventClickArg) => {
        if (
            window.confirm(`Delete the event "${selected.event.title}" from your calendar?`)
        ) {
            selected.event.remove();
        }
    }

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (newEventTitle && selectedDate){
            const calendarApi = selectedDate.view.calendar;
            calendarApi.unselect();
        

        const newEvent = {
            id: `${selectedDate?.start.toISOString()}-${newEventTitle}`,
            title: newEventTitle,
            start: selectedDate?.start,
            end: selectedDate?.end,
            allDat: selectedDate?.allDay,
        };

        calendarApi.addEvent(newEvent);
        handleCloseDialog();
    }};

    return (
    <div className="studyPlanner" style={{marginTop: "3rem", marginLeft: "6rem", overflow: "hidden"}}>
        <div className="title" style={{display: "flex", flexDirection: "row"}}>
            <h1 style={{fontSize: "2rem", fontWeight: "bold"}}>User's Study Planner</h1>
            <button style={{float: "right", marginLeft: "35vw", background: "var(--background-prime)", color: "var(--background)", paddingLeft:"1vw", paddingRight: "1vw"}}>Select Filter</button>
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
                
                eventsSet={(events) => setCurrentEvents(events)}
                initialEvents={typeof window !== "undefined" ? JSON.parse(localStorage.getItem("events") || "[]") : []}
                />
            </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add New Task
                    </DialogTitle>
                </DialogHeader>
                <form className="space-x-5 mb-4" onSubmit={handleAddEvent}>
                    <input type="text" placeholder="Task title" value={newEventTitle} onChange={(event) => setNewEventTitle(event.target.value)} required className="border border-gray-200 p-3 rounded-md text-lg"/>

                    <button className="bg-green-500 text-white p-3 mt-5 rounded-md" type="submit">Save</button>
                </form>
            </DialogContent>
        </Dialog>
        </>
    </div>

    )
}