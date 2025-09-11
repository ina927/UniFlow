"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button"
import styles from "./AssessmentControls.module.css"
import AssessmentModeToggle from "@/features/assessments/AssessmentModeToggle";
import RequiredMarkToggle from "@/features/assessments/RequiredMarkToggle";

type Props = {
    onAddAssessment?: () => void;
    showRequiredMarks?: boolean;
    onToggleRequired?: (next: boolean) => void;
};

export default function AssessmentControls({
    onAddAssessment,
    showRequiredMarks = false,
    onToggleRequired,
}: Props) {    
    
    const [mode, setMode] = useState<"view" | "whatif">("view");

    return (
        <div className={styles.container}>
            <div className={styles.topRow}>
                <AssessmentModeToggle mode={ mode } onChange={setMode} />
            </div>
            <div className={styles.bottomRow}>
                <RequiredMarkToggle
                    checked={showRequiredMarks}
                    onToggle={onToggleRequired ?? (() => {})}
                />
                <Button className={styles.addButton} onClick={onAddAssessment}>
                    + Add Assessment</Button>
            </div>
        </div>
    );


}