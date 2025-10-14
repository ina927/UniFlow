"use client"

import { useState } from "react";
import PlannerHeader from "@/features/planner/ui/PlannerHeader";
import TaskLists from "@/features/planner/ui/TaskList";

export default function PlannerPage() {
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
    const academicCourseId = 'dfe52aff-dc38-4b74-8067-95d1786b3c31';

    const handleSubjectFilterChange = (subjectId: string | null) => {
        setSelectedSubjectId(subjectId);
    };

    return (
        <div>
            <PlannerHeader 
                academicCourseId={academicCourseId}
                onSubjectFilterChange={handleSubjectFilterChange}
            />
            <TaskLists 
                academicCourseId={academicCourseId}
                filterBySubjectId={selectedSubjectId}
            />
        </div>
    );
}