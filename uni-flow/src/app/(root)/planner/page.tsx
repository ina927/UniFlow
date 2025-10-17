"use client"

import { useState } from "react";
import { PlannerHeader } from "@/features/planner/ui/PlannerHeader";
import { TaskLists } from "@/features/planner/ui/TaskLists";
import styles from "./page.module.css"
import { useAuthStore, useAcademicStore } from "@/shared/stores";

export default function PlannerPage() {
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
    const { userId } = useAuthStore();
    const { academicCourseId, setAcademicCourseId } = useAcademicStore();

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
