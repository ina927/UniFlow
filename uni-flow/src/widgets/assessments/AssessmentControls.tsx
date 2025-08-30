"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button"
import styles from "./AssessmentControls.module.css"
import AssessmentModeToggle from "@/features/assessments/AssessmentModeToggle";
import RequiredMarkToggle from "@/features/assessments/RequiredMarkToggle";

export default function AssessmentControls() {
    const [mode, setMode] = useState<"view" | "whatif">("view");
    const [showRequiredMarks, setShowRequiredMarks] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.topRow}>
                <AssessmentModeToggle mode={ mode } onChange={setMode} />
            </div>
            <div className={styles.bottomRow}>
                <RequiredMarkToggle
                    checked={showRequiredMarks}
                    onToggle={() => setShowRequiredMarks(!showRequiredMarks)}/>
                <Button className={styles.addButton}> + Add Assessment</Button>
            </div>
        </div>
    );


}