"use client";

// React import

export default function studyPlanner(){
    return (
    <div className="studyPlanner" style={{marginTop: "3rem", marginLeft: "6rem"}}>
        <div className="title" style={{display: "flex", flexDirection: "row"}}>
            <h1 style={{fontSize: "2rem", fontWeight: "bold"}}>User's Study Planner</h1>
            <button style={{float: "right", marginLeft: "35vw", background: "var(--foreground)", color: "var(--background)", paddingLeft:"1vw", paddingRight: "1vw"}}>Select Filter</button>
            <button style={{float: "right", marginLeft: "2vw", background: "var(--foreground)", color: "var(--background)", paddingLeft:"1vw", paddingRight: "1vw"}}>Calendar View</button>
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
                    <button style={{float: "right", background: "var(--button-inactive)", color: "var(--background)", borderRadius: "1rem", marginRight: "1.5vw", width: "5.3vw", height: "2vw", marginTop:"2vh"}}>New +</button>
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

    </div>
    )
}