"use client";

import {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/shared/ui/dialog"
import Link from "next/link";
import styles from "./page.module.css";

// database import
import Axios from "axios";
import { ToDoStatus } from "@/entities/enums";
import { ToDoEntity } from "@/entities/todos/entities";
import { ToDo } from "@/shared/generated/prisma";
import { Combobox } from "@/widgets/planner/SetFilterModal";
import { ComboboxForm } from "@/widgets/planner/SetSubjectModalForm";

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
    const [allFilter, setAllFilter] = useState<string[]>([]);
    const [filteredEvent, setFilteredEvent] = useState<ToDoEntity[]>([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>(""); // filter
    const [subId, setSubId] = useState<string>("")

    const [pendingEvent, setPendingEvent] = useState<ToDoEntity[]>([]);
    const [inProgressEvent, setInProgressEvent] = useState<ToDoEntity[]>([]);
    const [completedEvent, setCompletedEvent] = useState<ToDoEntity[]>([])

    const [academicCourseId, setAcademicCourseId] = useState<string>('');

    // data dummy for now
    const userId = 'baacd6fe-1729-4505-9b83-d9f4fd47ea1f'

    // click handler
    useEffect(() => {
        const fetchUser = async() => {
            // const userResponse = await fetch(`http://localhost:3000/api/users/${userId}`);
            // const userData = await userResponse.json();
            setAcademicCourseId('f55828ac-bb78-4345-afc0-152fc35c9f95'); // hard code
        }
        const fetchToDo = async() => {
            setNewEventTitle("")
            setContent("")
            setEndDate(null)
            getAllFilter();
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
        fetchUser();
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
            
            let fetchEvents;

            if (selectedSubjectId) {
                fetchEvents = filteredEvent;
                console.log("here", fetchEvents);
            } else {
                const responseData = await response.json();
                fetchEvents = responseData;
            }

            setFetchEvent(fetchEvents);
            setFilteredEvent([])

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

    const getAllFilter = async () => {
        const response = await fetch('http://localhost:3000/api/subjects')
        const allFilter = await response.json()

        setAllFilter(allFilter);
    }

    const setFilteredEvents = async (subjectId: string) => {
        const currentEvents = events;
        if (subjectId){
            const filtered = currentEvents.filter((event: { subjectId: string; }) => event.subjectId === subjectId);
            setFilteredEvent(filtered);
            refresh();
        } else {
            return
        }
    }

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

        if (newEventTitle === ""){
            setNewEventTitle("New Task")
        }
        
        if (selectedEvent){
        await Axios.put(`/api/todos/${selectedEvent.id}`, {
            title: newEventTitle,
            description: content,
            subjectId: subId,
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

        if (newEventTitle === ""){
            setNewEventTitle("New Task")
        }

        const newToDo = {
            userId: 'baacd6fe-1729-4505-9b83-d9f4fd47ea1f',
            subjectId: subId,
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

    const handleSubjectFilterChange = async (subjectId: string) => {
        
        console.log(subjectId)

        const response = await fetch('http://localhost:3000/api/todos', {
            headers: {
                userId: userId,
            }
        });
        
        const freshEvents = await response.json();
        
        if (subjectId) {
            const filtered = freshEvents.filter((event: ToDoEntity) => 
                event.subjectId === subjectId
            );
            
            const pendings = filtered.filter((e: ToDoEntity) => e.status === ToDoStatus.PENDING);
            const inProgress = filtered.filter((e: ToDoEntity) => e.status === ToDoStatus.IN_PROGRESS);
            const completed = filtered.filter((e: ToDoEntity) => e.status === ToDoStatus.DONE);
            
            console.log("Pen", pendings.length);
            console.log("Between", inProgress.length);
            console.log("Done", completed.length);
            
            setFetchEvent(freshEvents);
            setSelectedSubjectId(subjectId);
            setPendingEvent(pendings);
            setInProgressEvent(inProgress);
            setCompletedEvent(completed);
        } else {
            // Show ALL - no filter
            setFetchEvent(freshEvents);
            setSelectedSubjectId("");
            setPendingEvent(freshEvents.filter((e: ToDoEntity) => e.status === ToDoStatus.PENDING));
            setInProgressEvent(freshEvents.filter((e: ToDoEntity) => e.status === ToDoStatus.IN_PROGRESS));
            setCompletedEvent(freshEvents.filter((e: ToDoEntity) => e.status === ToDoStatus.DONE));
        }
        

    }

    const handleSubjectChange = (subjectId: string) => {
        console.log(subjectId)
        if (subjectId){
            setSubId(subjectId)
        }
    }

    return (
    <div className="studyPlanner" style={{marginTop: "3rem", marginLeft: "8rem"}}>
        <div className="title" style={{display: "flex", flexDirection: "row"}}>
            <h1 className="text-large-title-bold" style={{width: "40vw"}}>User&#39;s Study Planner</h1>
            <Combobox academicCourseId={academicCourseId} onSubjectChange={handleSubjectFilterChange}/>
            {/* <button style={{float: "right", marginLeft: "10vw", background: "var(--background-prime)", color: "var(--background)", paddingLeft:"1vw", paddingRight: "1vw", height: "5vh", width: "10vw"}} className="text-title3-bold">Select Filter</button> */}
            <Link href="../calendar" style={{float: "right", marginLeft: "0.5vw", background: "var(--background-prime)", color: "var(--background)", paddingLeft:"0.5vw", paddingRight: "0.5vw", paddingTop: "1vh", height: "5vh", width: "2.5vw", borderRadius: "1vw", textAlign: "left"}} className="text-title3-bold">📆</Link>
        </div>
        <br />
        <h3 className="text-title3">Last updated: version 1.0</h3>
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
                        <li key={"plannner-"+ pendingEvent.indexOf(event)}>
                        <div className={styles.todoCard}>
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}} className="text-body1-semibold">
                                <h2 style={{paddingRight: "0.5vw"}}>{pendingEvent.indexOf(event) + 1}</h2>
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
                <div className={styles.todoList2} style={{height: "53vh"}}>
                <ul style={{marginLeft: "1rem", marginTop: "3rem"}}>
                {inProgressEvent.length <= 0 && (
                        <div className="italic text-center text-gray-400">
                            Nothing in Here Yet..
                        </div>
                    )}
                    {inProgressEvent.length > 0 && inProgressEvent.map((event:ToDoEntity) => (
                        <li key={"plannner-"+ inProgressEvent.indexOf(event)}>
                        <div className={styles.todoCard}>
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}} className="text-body1-semibold">
                                <h2 style={{paddingRight: "0.5vw"}}>{inProgressEvent.indexOf(event) + 1}</h2>
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
                <div className={styles.todoList2} style={{height: "53vh"}}>
                <ul style={{marginLeft: "1rem", marginTop: "3rem"}}>
                {completedEvent.length <= 0 && (
                        <div className="italic text-center text-gray-400">
                            Nothing in Here Yet..
                        </div>
                    )}
                    {completedEvent.length > 0 && completedEvent.map((event:ToDoEntity) => (
                        <li key={"plannner-"+ completedEvent.indexOf(event)}>
                        <div className={styles.todoCard}>
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}} className="text-body1-semibold">
                                <h2 style={{paddingRight: "0.5vw"}}>{completedEvent.indexOf(event) + 1}</h2>
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
                    <br />
                    <div className="tags" style={{display: "flex", flexDirection: "row"}}>
                        <label style={{marginLeft: "0.9vw", paddingRight: "1.5vw", marginTop: "1vh"}}>Subject: </label>
                        <ComboboxForm academicCourseId={academicCourseId} onSubjectChange={handleSubjectChange}/>
                    </div>
                    <br />
                    <hr style={{width: "93%", marginLeft: "1vw", height: "1px", background: "black", opacity: 0.8}}/>
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
                    {/* <div className="due-date" style={{display: "flex", flexDirection: "row"}}>
                        <label style={{marginLeft: "0.9vw", paddingRight: "1.5vw"}}>Due Date: </label>
                        <input type="date" name="deadline" required onChange={(e) => {
                            const date = e.target.value;
                            const newDate = new Date(date)
                            setEndDate(newDate)
                        }}/>
                    </div>
                    <br /> */}
                    <div className="tags" style={{display: "flex", flexDirection: "row"}}>
                        <label style={{marginLeft: "0.9vw", paddingRight: "1.5vw", marginTop: "1vh"}}>Subject: </label>
                        <ComboboxForm academicCourseId={academicCourseId} onSubjectChange={handleSubjectChange}/>
                    </div>
                    <br />
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