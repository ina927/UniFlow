"use client"

import { useState, useMemo } from "react";

import SubjectHeader from "@/widgets/assessments/SubjectHeader";
import TutorInfoCard from "@/widgets/assessments/TutorInfoCard";
import AssessmentControls from "@/widgets/assessments/AssessmentControls";
import AssessmentTable from "@/widgets/assessments/AssessmentTable";
import AddAssessmentModal from "@/widgets/assessments/AddAssessmentModal";
import EnterScoreModal from "@/widgets/assessments/EnterScoreModal";
import GradeSummary from "@/widgets/assessments/GradeSummary";
import { Grade } from "@/entities/assessments";
import {
  useAssessmentsQuery,
  useCreateAssessment,
  useEnterScore,
} from "@/features/assessments/hooks/useAssessmentsQuery";
import { useSubjectDetailQuery } from "@/features/academics/hooks/useSubjectDetailQuery";
import { letterFromPercent } from "@/features/assessments/grade-logics";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";


/**
 * AssessmentsPage
 * Main page for displaying all assessments of a subject.
 * Combines header, controls, table, summary, and modals into one view.
 * Uses ?subjectId=... query param (no route change required)
 */
export default function AssessmentsPage(){
    // Read subjectId from query string: /assessments?subjectId=subj-41026
    const searchParams = useSearchParams();
    const subjectId = searchParams.get("subjectId") ?? "";

    // Load subject list and pick the current one by id
    const { data: subject } = useSubjectDetailQuery(subjectId);

    // Assessments query/mutations
    const { data: items = [], isLoading } = useAssessmentsQuery(subjectId);
    const currentTotalWeight = useMemo(
        () => items.reduce((acc, it) => acc + (it.weight || 0), 0),
        [items]
    );
    const createAssessment = useCreateAssessment(subjectId);
    const enterScore = useEnterScore(subjectId);
    
    // Local UI state
    const [mode, setMode] = useState<"view" | "whatif">("view");

    // What-If overlay map: id → number | null | undefined
    // undefined: no simulation, number: simulated score, null: simulated ungraded
    const [whatIf, setWhatIf] = useState<Record<string, number | null | undefined>>({});

    // Merge items with what-if overlay only when mode === "whatif"
    const displayItems = useMemo(() => {
        if (mode !== "whatif") return items;
        return items.map((it) => {
        const sim = whatIf[it.id];
        return sim !== undefined ? { ...it, score: sim } : it;
        });
    }, [items, whatIf, mode]);

    // Handlers for what-if edits (UI only)
    const handleWhatIfScoreChange = (id: string, value: number | null) => {
        setWhatIf(prev => ({ ...prev, [id]: value }));
    };

    // State for EnterScore modal
    const [enterOpen, setEnterOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const selected = useMemo(() => items.find(i => i.id === selectedId) ?? null, [items, selectedId]);

    // Handler for opening EnterScore modal
    const handleEnterScore = (id: string) => {
        setSelectedId(id);
        setEnterOpen(true);
    };

    // Save score via API 
    const handleSaveScore = (id: string, nextScore: number) => {
        enterScore.mutate({ assessmentId: id, score: nextScore });
    };

    // Clear score via API (send score = null)
    const handleClearScore = (id: string) => {
        enterScore.mutate({ assessmentId: id, score: null });
    };

    const [openAdd, setOpenAdd] = useState(false);
    const [showRequired, setShowRequired] = useState(false);
    const goal = subject?.goalGrade != null ? letterFromPercent(subject.goalGrade) : Grade.HD;

    // Reset simulation when switching back to view
    const handleModeChange = (next: "view" | "whatif") => {
        setMode(next);
        if (next === "view") setWhatIf({});
    };

    // revision token based on what-if map (small dataset → OK)
    const whatIfRev = useMemo(
        () => Object.entries(whatIf).map(([k, v]) => `${k}:${v ?? ""}`).join("|"),
        [whatIf]
    );
    
    return ( 
        <div className={styles.container}>
            <div className={styles.left}> 
                {/* Subject header sourced from DB (fallbacks keep UI stable) */}
                <SubjectHeader
                    subjectName={subject?.title ?? "—"}
                    subjectCode={subject?.code ?? "—"}
                    term={subject?.termTitle ?? "—"}
                    year={subject?.academicYear ?? new Date().getFullYear()}
                    creditPoint={subject?.credits ?? 0}
                />
                <AssessmentControls 
                    mode={mode}
                    onModeChange={handleModeChange}
                    onAddAssessment={() => setOpenAdd(true)}
                    showRequiredMarks={showRequired}
                    onToggleRequired={() => setShowRequired(v => !v)}
                />
                <AssessmentTable 
                    items={displayItems}
                    mode={mode}
                    onEnterScore={handleEnterScore}
                    onWhatIfScoreChange={handleWhatIfScoreChange}
                    showRequiredMarks={showRequired}
                    goal={goal}
                />
            </div>
            <div className={styles.right}> 
                <TutorInfoCard
                    tutorEmail={subject?.labTutorEmail ?? "-"}
                    coordinatorEmail={subject?.coordinatorEmail ?? "-"}
                />
                <GradeSummary
                    key={`${mode}-${whatIfRev}`}
                    goal={goal}
                    items={displayItems}
                    whatIfMode={mode === "whatif"}
                />            
                </div> 

            {/* Modal for adding a new assessment */}
            <AddAssessmentModal 
                open={openAdd} 
                onOpenChange={setOpenAdd} 
                subjectId={subjectId}
                currentTotalWeight={currentTotalWeight}                
            />

            {/* Modal for entering/updating score */}
            {selected && (
                <EnterScoreModal
                    open={enterOpen}
                    onOpenChange={setEnterOpen}
                    assessment={{
                        id: selected.id,
                        title: selected.title,
                        maxScore: selected.maxScore,
                        score: selected.score ?? null,
                    }}
                    onSave={handleSaveScore}
                    onClear={handleClearScore}
                />
            )}
        </div>
    ); 
}