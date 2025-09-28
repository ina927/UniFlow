"use client";

import {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import Link from "next/link";
import styles from "./page.module.css";

// database import
import Axios from "axios";
import { ToDoStatus } from "@/entities/enums";
import { ToDoEntity } from "@/entities/todos/entities";
import { ToDo } from "@/shared/generated/prisma";

// React import

export default function StudyPlanner(){

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState<boolean>(false);

    // for database control (tags in form is to opt for the subject id)
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [newEventTitle, setNewEventTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [taskStatus, setTaskStatus] = useState<string>("");
    const [events, setFetchEvent] = useState<ToDoEntity[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<ToDoEntity>();

    const [pendingEvent, setPendingEvent] = useState<ToDoEntity[]>([]);
    const [inProgressEvent, setInProgressEvent] = useState<ToDoEntity[]>([]);
    const [completedEvent, setCompletedEvent] = useState<ToDoEntity[]>([])

    // data dummy for now
    const userId = '68ad41c7486238ade8bb2f2d'

    // click handler
    useEffect(() => {
        const fetchToDo = async() => {
            setNewEventTitle("")
            setContent("")
            setEndDate(null)
            const response = await fetch('http://localhost:3000/api/todos', {
                headers: {
                    userId: userId,
                }
            });
 
            const fetchEvents =  await response.json();
            setFetchEvent(fetchEvents);

            // filtering
            const pendings = fetchEvents.filter((event: { status: ToDoStatus; }) => event.status === ToDoStatus.PENDING)
            setPendingEvent(pendings);

            const inProgress = fetchEvents.filter((event: {status: ToDoStatus}) => event.status === ToDoStatus.IN_PROGRESS)
            setInProgressEvent(inProgress);

            const dones = fetchEvents.filter((event: {status: ToDoStatus}) => event.status === ToDoStatus.DONE)
            setCompletedEvent(dones);

            console.log(events)        }
        fetchToDo();
    }, []); //open json file
    
    
    const refresh = () => {
        const fetchToDo = async() => {
            setNewEventTitle("")
            setContent("")
            setEndDate(null)
            const response = await fetch('http://localhost:3000/api/todos', {
                headers: {
                    userId: userId,
                }
            });
 
            const fetchEvents =  await response.json();
            setFetchEvent(fetchEvents);

            // filtering
            const pendings = fetchEvents.filter((event: { status: ToDoStatus; }) => event.status === ToDoStatus.PENDING)
            setPendingEvent(pendings);

            const inProgress = fetchEvents.filter((event: {status: ToDoStatus}) => event.status === ToDoStatus.IN_PROGRESS)
            setInProgressEvent(inProgress);

            const dones = fetchEvents.filter((event: {status: ToDoStatus}) => event.status === ToDoStatus.DONE)
            setCompletedEvent(dones);

            console.log(events)        }
        fetchToDo();
    };

    const statusChangePending = async (event: ToDoEntity) => {
        const updated = { ...event, status: ToDoStatus.IN_PROGRESS };
        await Axios.put(`/api/todos/${event.id}`, {
            status: ToDoStatus.IN_PROGRESS
        });
        refresh();
    }

    const statusChangeComplete = async (event: ToDoEntity) => {
        const updated = { ...event, status: ToDoStatus.DONE };
        await Axios.put(`/api/todos/${event.id}`, {
            status: ToDoStatus.DONE
        });
        refresh();
    }

    const deleteToDo = async (event:ToDoEntity) => {
        if (!event) return;
        await Axios.delete(`/api/todos/${event.id}`);
        refresh();
    }

    const updateDialog = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(selectedEvent)
        
        if (selectedEvent){
        await Axios.put(`/api/todos/${selectedEvent.id}`, {
            title: newEventTitle,
            description: content,
            endDate: endDate,
        });

        refresh();
        setIsDialogUpdateOpen(false);
        }
    }

    const handleEditButton = (event: ToDoEntity) => {
        setSelectedEvent(event);
        setIsDialogUpdateOpen(true);
        setEndDate(event.endDate)
        setContent(String(event.description))
        console.log(content)
        setNewEventTitle(String(event.title))  
    }

    const handleAddButton = () => {
        setIsDialogOpen(true);
        setNewEventTitle("")
        setContent("")
        setEndDate(null)
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setNewEventTitle("");
    };

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        // this is for the database
        const newToDo = {
            userId: '83482f49-8367-48d1-93f0-e98f01010f0f',
            subjectId: '91bc3c52-fe3c-4df8-ad77-284c108730a6',
            assessmentId: null,
            title: newEventTitle,
            content: content,
            startDate: endDate, //new Date()
            endDate: endDate,
            taskStatus: ToDoStatus.PENDING
        }

        const response = await Axios.post('/api/todos', {newToDo})
        console.log(response)
        refresh();
        handleCloseDialog();
    };

    return (
    <div className="studyPlanner" style={{marginTop: "3rem", marginLeft: "4rem"}}>
        <div className="title" style={{display: "flex", flexDirection: "row"}}>
            <h1 className="text-large-title-bold" style={{width: "40vw"}}>User&#39;s Study Planner</h1>
            <button style={{float: "right", marginLeft: "10vw", background: "var(--background-prime)", color: "var(--background)", paddingLeft:"1vw", paddingRight: "1vw", height: "5vh", width: "10vw"}} className="text-title3-bold">Select Filter</button>
            <Link href="../calendar" style={{float: "right", marginLeft: "2vw", background: "var(--background-prime)", color: "var(--background)", paddingLeft:"1vw", paddingRight: "1vw", paddingTop: "1vh", height: "5vh", width: "10vw", textAlign: "center"}} className="text-title3-bold">Calendar View</Link>
        </div>
        <br />
        <h3 className="text-title3">Last updated: DD/MM/YYYY</h3>
        <br />
        <div className={styles.todoList}>
            <div className={styles.list} id="planned">
                <div className="list-header" style={{display: "flex", flexDirection: "row"}}>
                <div className="logo" style={{background: "var(--background)", borderRadius: "50%", height: "2.5vw", width: "2.5vw", marginTop: "4vh", marginLeft: "1.8vw"}}>
                    <h1 className="text-large-title-bold" style={{color: "var(--background-prime)", marginLeft: "0.9vw", marginTop:"-0.5vh"}}>!</h1>
                </div>
                <h1 className="text-large-title-bold" style={{color: "var(--background)", marginTop: "3vh", marginLeft: "2vw"}}>Planned</h1>
                </div>
                <div className="createTo-do" style={{paddingBottom: "0.5rem"}}>
                    <button id="add-to-do" onClick={handleAddButton} style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "1.5vw", width: "5.3vw", height: "2vw", marginTop:"2vh"}} className="text-body1">New +</button>
                </div>

                <br /><br />

                <div className={styles.todoList2}>
                <ul style={{marginLeft: "1rem"}}>
                {pendingEvent.length <= 0 && (
                        <div className="italic text-center text-gray-400">
                            Nothing in Here Yet..
                        </div>
                    )}
                    {pendingEvent.length > 0 && pendingEvent.map((event:ToDoEntity) => (
                        <li key={"plannner-"+events.indexOf(event)}>
                        <div className={styles.todoCard}>
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}} className="text-body1-semibold">
                                <h2 style={{paddingRight: "0.5vw"}}>{events.indexOf(event) + 1}</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>{event.title}</h2>
                            </div>
                            <h3 className="text-body1" style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: {(event.endDate.toString().substring(0, 10))}</h3>
                            <div>
                            <button onClick={() => statusChangePending(event)} style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", marginTop: "-0.5vh"}} className="text-body1">Start</button>
                            <button onClick={() => handleEditButton(event)} 
                            style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "2rem", width: "1.7vw", height: "1.7vw", marginTop: "-0.5vh", marginRight: "0.4vw"}} className="text-body1">✎</button>
                            </div>
                        </div>
                    </li>
                    ))}
                    {/* <li>
                        <div className={styles.todoCard}>
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}} className="text-body1-semibold">
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 className="text-body1" style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", marginTop: "-1vh"}} className="text-body1">Start</button>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className={styles.todoCard}>
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}} className="text-body1-semibold">
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 className="text-body1" style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", marginTop: "-1vh"}} className="text-body1">Start</button>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className={styles.todoCard}>
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}} className="text-body1-semibold">
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 className="text-body1" style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", marginTop: "-1vh"}} className="text-body1">Start</button>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className={styles.todoCard}>
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}} className="text-body1-semibold">
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 className="text-body1" style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", marginTop: "-1vh"}} className="text-body1">Start</button>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className={styles.todoCard}>
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}} className="text-body1-semibold">
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 className="text-body1" style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", marginTop: "-1vh"}} className="text-body1">Start</button>
                            </div>
                        </div>
                    </li>
                    <br /> */}
                </ul>
                </div>
            </div>

            <div className={styles.list} id="in-progress" style={{marginLeft: "3vw"}}>
                <div className="list-header" style={{display: "flex", flexDirection: "row"}}>
                <div className="logo" style={{background: "var(--background)", borderRadius: "50%", height: "2.5vw", width: "2.5vw", marginTop: "4vh", marginLeft: "1.8vw"}}>
                    <h1 style={{color: "var(--background-prime)", marginLeft: "0.9vw", marginTop:"-0.5vh", fontSize: "1.8rem", fontWeight: "bolder"}}>!</h1>
                </div>
                <h1 className="text-large-title-bold" style={{color: "var(--background)", marginTop: "3vh", marginLeft: "2vw"}}>In-progress</h1>
                </div>
                <br />
                {/* <div className="createTo-do" style={{paddingBottom: "0.5rem"}}>
                    <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "1.5vw", width: "5.3vw", height: "2vw", marginTop:"2vh", opacity: 0}}>New +</button>
                </div> */}
                <div className={styles.todoList2} style={{height: "57.5vh"}}>
                <ul style={{marginLeft: "1rem", marginTop: "3rem"}}>
                {inProgressEvent.length <= 0 && (
                        <div className="italic text-center text-gray-400">
                            Nothing in Here Yet..
                        </div>
                    )}
                    {inProgressEvent.length > 0 && inProgressEvent.map((event:ToDoEntity) => (
                        <li key={"plannner-"+events.indexOf(event)}>
                        <div className={styles.todoCard}>
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}} className="text-body1-semibold">
                                <h2 style={{paddingRight: "0.5vw"}}>{events.indexOf(event) + 1}</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>{event.title}</h2>
                            </div>
                            <h3 className="text-body1" style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: {(event.endDate.toString().substring(0, 10))}</h3>
                            <div>
                            <button onClick={() => statusChangeComplete(event)} style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", marginTop: "-0.3vh"}} className="text-body1">Finish</button>
                            <button onClick={() => handleEditButton(event)}  style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "2rem", width: "1.7vw", height: "1.7vw", marginTop: "-0.3vh", marginRight: "0.4vw"}} className="text-body1">✎</button>
                            </div>
                        </div>
                    </li>
                    ))}
                    {/* <li>
                        <div className={styles.todoCard}>
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}} className="text-body1-semibold">
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 className="text-body1" style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", marginTop: "-1vh"}} className="text-body1">Done</button>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className={styles.todoCard}>
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}} className="text-body1-semibold">
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 className="text-body1" style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", marginTop: "-1vh"}} className="text-body1">Done</button>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className={styles.todoCard}>
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}} className="text-body1-semibold">
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 className="text-body1" style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", marginTop: "-1vh"}} className="text-body1">Done</button>
                            </div>
                        </div>
                    </li>
                    
                    <br /> */}
                </ul>
                </div>
            </div>

            <div className={styles.list} id="completed" style={{marginLeft: "3vw"}}>
                <div className="list-header" style={{display: "flex", flexDirection: "row"}}>
                <div className="logo" style={{background: "var(--background)", borderRadius: "50%", height: "2.5vw", width: "2.5vw", marginTop: "4vh", marginLeft: "1.8vw"}}>
                    <h1 style={{color: "var(--background-prime)", marginLeft: "0.9vw", marginTop:"-0.5vh", fontSize: "1.8rem", fontWeight: "bolder"}}>!</h1>
                </div>
                <h1 className="text-large-title-bold" style={{color: "var(--background)", marginTop: "3vh", marginLeft: "2vw"}}>Completed</h1>
                </div>
                <br />
                {/* <div className="createTo-do" style={{paddingBottom: "0.5rem"}}>
                    <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "1.5vw", width: "5.3vw", height: "2vw", marginTop:"2vh", opacity: 0}}>New +</button>
                </div> */}
                <div className={styles.todoList2} style={{height: "57.5vh"}}>
                <ul style={{marginLeft: "1rem", marginTop: "3rem"}}>
                {completedEvent.length <= 0 && (
                        <div className="italic text-center text-gray-400">
                            Nothing in Here Yet..
                        </div>
                    )}
                    {completedEvent.length > 0 && completedEvent.map((event:ToDoEntity) => (
                        <li key={"plannner-"+events.indexOf(event)}>
                        <div className={styles.todoCard}>
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}} className="text-body1-semibold">
                                <h2 style={{paddingRight: "0.5vw"}}>{events.indexOf(event) + 1}</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>{event.title}</h2>
                            </div>
                            <h3 className="text-body1" style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: {(event.endDate.toString().substring(0, 10))}</h3>
                            <div>
                            <button onClick={() => deleteToDo(event)} style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", marginTop: "-0.5vh"}} className="text-body1">Delete</button>
                            </div>
                        </div>
                    </li>
                    ))}

                {/* <li>
                        <div className={styles.todoCard}>
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}} className="text-body1-semibold">
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 className="text-body1" style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", marginTop: "-1vh"}} className="text-body1">Delete</button>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className={styles.todoCard}>
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}} className="text-body1-semibold">
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 className="text-body1" style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", marginTop: "-1vh"}} className="text-body1">Delete</button>
                            </div>
                        </div>
                    </li>
                    <br /> */}
                </ul>
                </div>
            </div>
        </div>

        <>
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

        <Dialog open={isDialogUpdateOpen} onOpenChange={setIsDialogUpdateOpen}>
            <DialogContent>
                <br />
                <DialogHeader>
                    <DialogTitle style={{marginLeft: "1vw"}}>
                        Update Task
                    </DialogTitle>
                </DialogHeader>
                <form className="space-x-5 mb-4" style={{display: "flex",flexDirection: "column"}} onSubmit={updateDialog}>
                    <input type="text" placeholder="NEW TASK" value={newEventTitle} onChange={(event) => setNewEventTitle(event.target.value)} required style={{borderBottom: "solid 3px gray", fontWeight: "bold", fontSize: "1.5rem", marginLeft:"0.7vw", opacity: 0.6, width: "97%"}} className="p-1 text-lg"/>

                    <textarea placeholder="Description(optional) (150 characters max)" className="p-3" style={{height: "10vh", wordWrap: "break-word", textWrap: "balance"}} maxLength={150} value={content} onChange={(e) => {
                        setContent(e.target.value)
                    }}/>
                    <div className="tags" style={{display: "flex", flexDirection: "row"}}>
                        <label style={{marginLeft: "0.9vw", paddingRight: "1.5vw"}}>Tags: currently unavailable</label>
                        <input type="text" name="deadline" /> {/*placeholder for now*/}
                    </div>
                    <hr style={{width: "93%", marginLeft: "1vw", height: "1px", background: "black", opacity: 0.8}}/>
                    <button className="text-white p-3 mt-5 rounded-md" style={{width: "92%", color: "var(--background-prime)", background: "(var(--foreground)", border: "solid 1px var(--background-prime)", marginLeft: "1vw"}} type="submit">Save</button>
                    <button className="text-white p-3 mt-5 rounded-md" style={{width: "92%", color: "var(--background-prime)", background: "(var(--foreground)", border: "solid 1px var(--background-prime)", marginLeft: "1vw"}} onClick={() => {
                        try {
                            const e = selectedEvent;
                            if (e){
                                deleteToDo(e);
                            }
                        } catch (e: any){
                            console.log("No event is chosen")
                        }
                    }}>Delete</button>
                </form>
            </DialogContent>
        </Dialog>

    </div>
    )
}