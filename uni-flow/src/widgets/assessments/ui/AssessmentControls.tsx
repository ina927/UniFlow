"use client"

import { Button } from "@/shared/ui/button"
import { AssessmentModeToggle, RequiredMarkToggle } from "@/features/assessments/ui";
import { Plus } from "lucide-react";
import styles from "./AssessmentControls.module.css"

type Props = {
    mode: "view" | "whatif";
    onModeChange: (m: "view" | "whatif") => void;
    showRequiredMarks?: boolean;
    onToggleRequired?: (next: boolean) => void;
    onAddAssessment?: () => void;
};

export const AssessmentControls = ({
    mode,
    onModeChange,
    showRequiredMarks = false,
    onToggleRequired,
    onAddAssessment,
}: Props) => {    
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
                    <Plus size={16}/> Add Assessment</Button>
            </div>
            {mode === "whatif" && (
                <span className={styles.simNotice}>
                    You are on What-if simulation mode: These scores are not saved.
                </span>
            )}
        </div>
    );
}
