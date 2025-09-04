"use client"

import { useState } from "react";

import SubjectHeader from "@/widgets/assessments/SubjectHeader";
import TutorInfoCard from "@/widgets/assessments/TutorInfoCard";
import AssessmentControls from "@/widgets/assessments/AssessmentControls";
import AssessmentTable from "@/widgets/assessments/AssessmentTable";
import AddAssessmentModal from "@/widgets/assessments/AddAssessmentModal";
import styles from "./page.module.css";

import { Assessment, AssessmentType } from "@/entities/assessments";
import { Grade } from "@/entities/assessments";

export default function AssessmentsPage(){ 
    const exampleSubject = { 
        subjectName: "Advanced Software Development", 
        subjectCode: "41026", term: "Spring", year: 2025, 
        creditPoint: 6, 
    } 
    const exampleTutorInfo = {
        tutorEmail: "dyer.david@uts.edu.au",
        coordinatorEmail: "hua.zuo@uts.edu.au",
    };

    const [mode]=useState<"view" | "whatif">("view");

    const items: Assessment[] = [
        {
            id: "a1",
            subjectId: "subj-41026",
            title: "Assessment task 1: Project Release 0",
            type: AssessmentType.GROUP_INDV_ASSIGNMENT,
            weight: 20,
            dueDate: "2025-09-05T23:59:00+10:00",
            maxScore: 20,
            score: 19.8,
            gradedDate: "2025-09-06",
            description: "Initial release",
        },
        {
            id: "a2",
            subjectId: "subj-41026",
            title: "Assessment task 2: Project Release 1",
            type: AssessmentType.GROUP_INDV_ASSIGNMENT,
            weight: 30,
            dueDate: "2025-10-03T23:59:00+10:00",
            maxScore: 100,
            score: 90,
            gradedDate: "2025-10-04",
            description: "Major iteration",
        },
        {
            id: "a3",
            subjectId: "subj-41026",
            title: "Assessment task 3: Project Release 2",
            type: AssessmentType.GROUP_INDV_ASSIGNMENT,
            weight: 30,
            dueDate: "2025-10-24T23:59:00+11:00",
            maxScore: 100,
            description: "Final release",
        },
        {
            id: "q1",
            subjectId: "subj-41026",
            title: "Quiz 1",
            type: AssessmentType.QUIZ,
            weight: 5,
            dueDate: "2025-08-27T23:59:00+10:00",
            maxScore: 10,
            score: 7,
        },
        {
            id: "q2",
            subjectId: "subj-41026",
            title: "Quiz 2",
            type: AssessmentType.QUIZ,
            weight: 5,
            dueDate: "2025-09-03T23:59:00+10:00",
            maxScore: 10,
            score: 10,
        },
        {
            id: "q3",
            subjectId: "subj-41026",
            title: "Quiz 3",
            type: AssessmentType.QUIZ,
            weight: 5,
            dueDate: "2025-10-07T23:59:00+11:00",
            maxScore: 10,
        },
        {
            id: "q4",
            subjectId: "subj-41026",
            title: "Quiz 4",
            type: AssessmentType.QUIZ,
            weight: 5,
            dueDate: "2025-10-27T23:59:00+11:00",
            maxScore: 10,
        },
    ];
    const handleEnterScore = (id: string) => {
        //modal open logic
    };
    const [openAdd, setOpenAdd] = useState(false);
    
    return ( 
        <div className={styles.container}>
            <div className={styles.left}> 
                <SubjectHeader {...exampleSubject}/>
                <AssessmentControls onAddAssessment={() => setOpenAdd(true)} />
                <AssessmentTable items={items} mode={mode} onEnterScore={handleEnterScore} />
            </div>
            <div className={styles.right}> 
                <TutorInfoCard {...exampleTutorInfo} />
                {/* GradeSummary */} 
            </div> 
            <AddAssessmentModal open={openAdd} onOpenChange={setOpenAdd} />

        </div>
    ); 
}