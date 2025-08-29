"use client";

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
import Link from "next/link";
import { DialogPortal } from "@radix-ui/react-dialog";

// React import

export default function studyPlanner(){

    const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [newEventTitle, setNewEventTitle] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);

    const handleAddButton = () => {
        setIsDialogOpen(true);
    }

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setNewEventTitle("");
    };

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
    <div className="studyPlanner" style={{marginTop: "3rem", marginLeft: "6rem"}}>
        <div className="title" style={{display: "flex", flexDirection: "row"}}>
            <h1 style={{fontSize: "2rem", fontWeight: "bold"}}>User's Study Planner</h1>
            <button style={{float: "right", marginLeft: "35vw", background: "var(--background-prime)", color: "var(--background)", paddingLeft:"1vw", paddingRight: "1vw"}}>Select Filter</button>
            <Link href="../calendar" style={{float: "right", marginLeft: "2vw", background: "var(--background-prime)", color: "var(--background)", paddingLeft:"1vw", paddingRight: "1vw", paddingTop:"0.8vw"}}>Calendar View</Link>
        </div>
        <br />
        <h3>Last updated: DD/MM/YYYY</h3>
        <br />
        <div className="to-doList">
            <div className="list" id="planned">
                <div className="list-header" style={{display: "flex", flexDirection: "row"}}>
                <div className="logo" style={{background: "var(--background)", borderRadius: "50%", height: "2.5vw", width: "2.5vw", marginTop: "4vh", marginLeft: "1.8vw"}}>
                    <h1 style={{color: "var(--background-prime)", marginLeft: "0.9vw", marginTop:"-0.5vh", fontSize: "1.8rem", fontWeight: "bolder"}}>!</h1>
                </div>
                <h1 style={{color: "var(--background)", marginTop: "3vh", marginLeft: "2vw", fontSize: "2rem"}}>Planned</h1>
                </div>
                <div className="createTo-do" style={{paddingBottom: "0.5rem"}}>
                    <button id="add-to-do" onClick={handleAddButton} style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "1.5vw", width: "5.3vw", height: "2vw", marginTop:"2vh"}}>New +</button>
                </div>
                <div className="todoList2">
                <ul style={{marginLeft: "1rem", marginTop: "3rem"}}>
                    <li>
                        <div className="to-doCard">
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}}>
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", fontSize: "0.8rem", marginTop: "-1vh"}}>Start</button>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="to-doCard">
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}}>
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", fontSize: "0.8rem", marginTop: "-1vh"}}>Start</button>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="to-doCard">
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}}>
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", fontSize: "0.8rem", marginTop: "-1vh"}}>Start</button>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="to-doCard">
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}}>
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", fontSize: "0.8rem", marginTop: "-1vh"}}>Start</button>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="to-doCard">
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}}>
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", fontSize: "0.8rem", marginTop: "-1vh"}}>Start</button>
                            </div>
                        </div>
                    </li>
                    <br />
                </ul>
                </div>
            </div>

            <div className="list" id="in-progress" style={{marginLeft: "3vw"}}>
                <div className="list-header" style={{display: "flex", flexDirection: "row"}}>
                <div className="logo" style={{background: "var(--background)", borderRadius: "50%", height: "2.5vw", width: "2.5vw", marginTop: "4vh", marginLeft: "1.8vw"}}>
                    <h1 style={{color: "var(--background-prime)", marginLeft: "0.9vw", marginTop:"-0.5vh", fontSize: "1.8rem", fontWeight: "bolder"}}>!</h1>
                </div>
                <h1 style={{color: "var(--background)", marginTop: "3vh", marginLeft: "2vw", fontSize: "2rem"}}>In-progress</h1>
                </div>
                <div className="createTo-do" style={{paddingBottom: "0.5rem"}}>
                    <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "1.5vw", width: "5.3vw", height: "2vw", marginTop:"2vh", opacity: 0}}>New +</button>
                </div>
                <div className="todoList2">
                <ul style={{marginLeft: "1rem", marginTop: "3rem"}}>
                    <li>
                        <div className="to-doCard">
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}}>
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", fontSize: "0.8rem", marginTop: "-1vh"}}>Complete</button>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="to-doCard">
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}}>
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", fontSize: "0.8rem", marginTop: "-1vh"}}>Complete</button>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="to-doCard">
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}}>
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", fontSize: "0.8rem", marginTop: "-1vh"}}>Complete</button>
                            </div>
                        </div>
                    </li>
                    
                    <br />
                </ul>
                </div>
            </div>

            <div className="list" id="completed" style={{marginLeft: "3vw"}}>
                <div className="list-header" style={{display: "flex", flexDirection: "row"}}>
                <div className="logo" style={{background: "var(--background)", borderRadius: "50%", height: "2.5vw", width: "2.5vw", marginTop: "4vh", marginLeft: "1.8vw"}}>
                    <h1 style={{color: "var(--background-prime)", marginLeft: "0.9vw", marginTop:"-0.5vh", fontSize: "1.8rem", fontWeight: "bolder"}}>!</h1>
                </div>
                <h1 style={{color: "var(--background)", marginTop: "3vh", marginLeft: "2vw", fontSize: "2rem"}}>Completed</h1>
                </div>
                <div className="createTo-do" style={{paddingBottom: "0.5rem"}}>
                    <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "1.5vw", width: "5.3vw", height: "2vw", marginTop:"2vh", opacity: 0}}>New +</button>
                </div>
                <div className="todoList2">
                <ul style={{marginLeft: "1rem", marginTop: "3rem"}}>
                    <li>
                        <div className="to-doCard">
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}}>
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", fontSize: "0.8rem", marginTop: "-1vh"}}>Done</button>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="to-doCard">
                            <div style={{display: "flex", flexDirection: "row", marginTop: "1vw", marginLeft: "1vw", paddingTop: "0.6vw"}}>
                                <h2 style={{paddingRight: "0.5vw"}}>1</h2>
                                <h2 style={{paddingRight: "0.5vw"}}>|</h2>
                                <h2>Study Task</h2>
                            </div>
                            <h3 style={{opacity: 0.7, fontSize: "0.8rem", marginLeft: "3vw"}}>Deadline: MM/DD/YYYY</h3>
                            <div>
                            <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "0.6vw", width: "4.5vw", height: "1.8vw", fontSize: "0.8rem", marginTop: "-1vh"}}>Done</button>
                            </div>
                        </div>
                    </li>
                    <br />
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

                    <textarea placeholder="Description(optional) (150 characters max)" className="p-3" style={{height: "10vh", wordWrap: "break-word", textWrap: "balance"}} maxLength={150}/>
                    <div className="due-date" style={{display: "flex", flexDirection: "row"}}>
                        <label style={{marginLeft: "0.9vw", paddingRight: "1.5vw"}}>Due Date: </label>
                        <input type="date" name="deadline" required/>
                    </div>
                    <div className="tags" style={{display: "flex", flexDirection: "row"}}>
                        <label style={{marginLeft: "0.9vw", paddingRight: "1.5vw"}}>Tags: </label>
                        <input type="text" name="deadline" /> {/*placeholder for now*/}
                    </div>
                    <hr style={{width: "93%", marginLeft: "1vw", height: "1px", background: "black", opacity: 0.8}}/>
                    <div className="to-do-table" style={{paddingTop: "1vh", display: "flex", flexDirection: "column"}}>
                    <label style={{marginLeft:"0.9vw", fontSize: "1.2rem", fontWeight: "bold"}}>To-do</label>
                        <ul style={{marginLeft:"1vw", opacity: 0.6}}>
                            <li>
                                <input type="checkbox" /> 
                                <label style={{paddingLeft: "1vw"}}>To-do task 1</label>
                            </li>
                        </ul>
                        <br />
                        <textarea name="to-do" placeholder="New to-do..." style={{marginLeft:"1vw", opacity: 0.6, width: "97%", borderBottom: "solid 3px gray"}}></textarea>
                        <input type="button" value="+" className="bg-green-500 text-white p-3 mt-5 rounded-md" style={{marginLeft: "1vw", marginTop: "1vh", background: "var(--background-prime)"}} />
                    </div>
                    <br />
                    <hr style={{width: "93%", marginLeft: "1vw", height: "1px", background: "black", opacity: 0.8}}/>
                    <button className="text-white p-3 mt-5 rounded-md" style={{width: "92%", color: "var(--background-prime)", background: "(var(--foreground)", border: "solid 1px var(--background-prime)", marginLeft: "1vw"}} type="submit">Save</button>
                </form>
            </DialogContent>
        </Dialog>
        </>

    </div>
    )
}