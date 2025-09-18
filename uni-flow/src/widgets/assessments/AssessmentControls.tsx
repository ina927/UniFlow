"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button"
import styles from "./AssessmentControls.module.css"
import AssessmentModeToggle from "@/features/assessments/ui/AssessmentModeToggle";
import RequiredMarkToggle from "@/features/assessments/ui/RequiredMarkToggle";

type Props = {
  onAddAssessment?: () => void;
};

export default function AssessmentControls({ onAddAssessment }: Props) {
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
                <Button className={styles.addButton} onClick={onAddAssessment}>
                    + Add Assessment</Button>
            </div>
        </div>
    );


}