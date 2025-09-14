"use client"

import { useState, useMemo } from "react";

import SubjectHeader from "@/widgets/assessments/SubjectHeader";
import TutorInfoCard from "@/widgets/assessments/TutorInfoCard";
import AssessmentControls from "@/widgets/assessments/AssessmentControls";
import AssessmentTable from "@/widgets/assessments/AssessmentTable";
import AddAssessmentModal from "@/widgets/assessments/AddAssessmentModal";
import GradeSummary from "@/widgets/assessments/GradeSummary";
import styles from "./page.module.css";

import { Assessment, AssessmentType } from "@/entities/assessments";
import { Grade } from "@/entities/assessments";
import EnterScoreModal from "@/widgets/assessments/EnterScoreModal";

/**
 * AssessmentsPage
 * Main page for displaying all assessments of a subject.
 * Combines header, controls, table, summary, and modals into one view.
 */
export default function AssessmentsPage(){ 
    const exampleSubject = { 
        subjectName: "Advanced Software Development", 
        subjectCode: "41026", term: "Spring", year: 2025, 
        creditPoint: 6, 
    } 
    const exampleTutorInfo = {
        tutorEmail: "dyer.david@uts.edu.au",
        coordinatorEmail: "hua.zuo@uts.edu.au",
    };

    const [mode, setMode] = useState<"view" | "whatif">("view");

    // Example assessments (would be replaced with DB data later)
    const [items, setItems] = useState<Assessment[]>([
        { id: "a1", subjectId: "subj-41026", title: "Assessment task 1: Project Release 0", type: AssessmentType.GROUP_INDV_ASSIGNMENT, weight: 20, dueDate: "2025-09-05T23:59:00+10:00", maxScore: 20, score: 19.8 },
        { id: "a2", subjectId: "subj-41026", title: "Assessment task 2: Project Release 1", type: AssessmentType.GROUP_INDV_ASSIGNMENT, weight: 30, dueDate: "2025-10-03T23:59:00+10:00", maxScore: 100, score: 90 },
        { id: "a3", subjectId: "subj-41026", title: "Assessment task 3: Project Release 2", type: AssessmentType.GROUP_INDV_ASSIGNMENT, weight: 30, dueDate: "2025-10-24T23:59:00+11:00", maxScore: 100 },
        { id: "q1", subjectId: "subj-41026", title: "Quiz 1", type: AssessmentType.QUIZ, weight: 5, dueDate: "2025-08-27T23:59:00+10:00", maxScore: 10, score: 7 },
        { id: "q2", subjectId: "subj-41026", title: "Quiz 2", type: AssessmentType.QUIZ, weight: 5, dueDate: "2025-09-03T23:59:00+10:00", maxScore: 10, score: 10 },
        { id: "q3", subjectId: "subj-41026", title: "Quiz 3", type: AssessmentType.QUIZ, weight: 5, dueDate: "2025-10-07T23:59:00+11:00", maxScore: 10 },
        { id: "q4", subjectId: "subj-41026", title: "Quiz 4", type: AssessmentType.QUIZ, weight: 5, dueDate: "2025-10-27T23:59:00+11:00", maxScore: 10 },
    ]);

    // What-If overlay map: id → number | null | undefined
    // undefined: no simulation, number: simulated score, null: simulated ungraded
    const [whatIf, setWhatIf] = useState<Record<string, number | null | undefined>>({});

    // Merge items with what-if overlay only when mode === "whatif"
    const displayItems = useMemo<Assessment[]>(() => {
        if (mode !== "whatif") return items;
        return items.map(it => {
        const sim = whatIf[it.id];
        return (sim !== undefined) ? { ...it, score: sim } : it;
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

    // Handler for saving updated score
    const handleSaveScore = (id: string, nextScore: number) => {
        setItems(prev =>
            prev.map(it => (it.id === id ? { ...it, score: nextScore } : it))
        );
        // TODO: Replace with API call when DB integration is ready
    };

    // Handler for clearing its score
    const handleClearScore = (id: string) => {
        setItems(prev => prev.map(it => (it.id === id ? { ...it, score: null } : it)));
        // TODO: API call for clearing score
    };

    const [openAdd, setOpenAdd] = useState(false);
    const [showRequired, setShowRequired] = useState(false);
    const goal = Grade.HD;

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
                <SubjectHeader {...exampleSubject}/>
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
                <TutorInfoCard {...exampleTutorInfo} />
                <GradeSummary
                    key={`${mode}-${whatIfRev}`}
                    goal={goal}
                    items={displayItems}
                    whatIfMode={mode === "whatif"}
                />            
                </div> 

            {/* Modal for adding a new assessment */}
            <AddAssessmentModal open={openAdd} onOpenChange={setOpenAdd} />

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