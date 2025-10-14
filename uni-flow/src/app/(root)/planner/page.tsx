"use client"

import { useState } from "react";
import PlannerHeader from "@/features/planner/ui/PlannerHeader";
import TaskLists from "@/features/planner/ui/TaskList";
import styles from "./page.module.css"

export default function PlannerPage() {
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
    const academicCourseId = 'dfe52aff-dc38-4b74-8067-95d1786b3c31';

    const handleSubjectFilterChange = (subjectId: string | null) => {
        
        console.log("Testing: " + subjectId)
        setSelectedSubjectId(subjectId); 
    };

    return (
        <div className={styles.planner}>
            <PlannerHeader 
                academicCourseId={academicCourseId}
                onSubjectFilterChange={handleSubjectFilterChange}
            />
            <br /><br />
            <TaskLists 
                academicCourseId={academicCourseId}
                filterBySubjectId={selectedSubjectId}
            />
        </div>
    );
}