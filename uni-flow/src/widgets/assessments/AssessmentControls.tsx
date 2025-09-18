"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button"
import styles from "./AssessmentControls.module.css"
import AssessmentModeToggle from "@/features/assessments/ui/AssessmentModeToggle";
import RequiredMarkToggle from "@/features/assessments/ui/RequiredMarkToggle";

type Props = {
    mode: "view" | "whatif";
    onModeChange: (m: "view" | "whatif") => void;
    showRequiredMarks?: boolean;
    onToggleRequired?: (next: boolean) => void;
    onAddAssessment?: () => void;
};

export default function AssessmentControls({
    mode,
    onModeChange,
    showRequiredMarks = false,
    onToggleRequired,
    onAddAssessment,
}: Props) {    
    return (
        <div className={styles.container}>
            <div className={styles.topRow}>
                <AssessmentModeToggle mode={ mode } onChange={onModeChange} />
            </div>
            <div className={styles.bottomRow}>
                <RequiredMarkToggle
                    checked={showRequiredMarks}
                    onToggle={onToggleRequired ?? (() => {})}
                />
                <Button className={styles.addButton} onClick={onAddAssessment}>
                    + Add Assessment</Button>
            </div>
            {mode === "whatif" && (
                <span className={styles.simNotice}>
                    You are on What-if simulation mode: These scores are not saved.
                </span>
            )}
        </div>
    );


}