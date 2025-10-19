"use client"

import { useState } from "react";
import { CalendarHeader } from "@/features/calendar/ui/CalendarHeader";
import { CalendarComp } from "@/features/calendar/ui/CalendarComp";
import styles from "./page.module.css"
import { useAcademicStore } from "@/shared/stores";

export default function PlannerPage() {
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
    const {academicCourseId} = useAcademicStore();

    const handleSubjectFilterChange = (subjectId: string | null) => {
        
        console.log("Testing: " + subjectId)
        setSelectedSubjectId(subjectId); 
    };

    return (
        <div className={styles.calendar}>
            <CalendarHeader 
                academicCourseId={academicCourseId!}
                onSubjectFilterChange={handleSubjectFilterChange}
            />
            <CalendarComp
                academicCourseId={academicCourseId!}
                filterBySubjectId={selectedSubjectId}
            />
        </div>
    );
}