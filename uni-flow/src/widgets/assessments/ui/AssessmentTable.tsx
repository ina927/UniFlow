"use client";
 
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/shared/ui";
import { AssessmentRow } from "@/features/assessments/ui";
import { Assessment, Grade } from "@/entities/assessments";
import { overallPercent, requiredMarksPerRemaining, isGraded, neededToReach, remainingWeightSum } from "@/features/assessments/grade-logics";

import styles from "./AssessmentTable.module.css";

type Props = {
    items: Assessment[];
    mode: "view" | "whatif";
    onEnterScore?: (id: string) => void;
    onWhatIfScoreChange?: (id: string, value: number | null) => void;
    showRequiredMarks?: boolean;
    goal?: Grade;
}

export const AssessmentTable = ({ 
    items, mode, onEnterScore, onWhatIfScoreChange,
    showRequiredMarks = false,
    goal = Grade.HD,
    }: Props) => {
    const need = neededToReach(items, goal);
    const left = remainingWeightSum(items);
    const goalUnreachable = need > left + 1e-9;
    const gradedCount = items.filter(i => i.score !== undefined && i.score !== null).length;
    const totalWeight = items.reduce((acc, it) => acc + (it.weight || 0), 0);
    const reqMap = requiredMarksPerRemaining(items, goal);
    const EPS = 1e-6;

    return(
        <div className={styles.wrapper}>
            <Table>
                <TableHeader>
                    <TableRow className={styles.headerRow}>
                        <TableHead className={styles.colTitle}>Title</TableHead>
                        <TableHead className={styles.colDue}>Due</TableHead>
                        <TableHead className={styles.colWeight}>Weight</TableHead>
                        <TableHead className={styles.colScore}>Score</TableHead>
                        <TableHead className={styles.colAction}></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => {
                        const req = !isGraded(item) ? reqMap[item.id] : undefined;
                        return (
                            <AssessmentRow
                                key={item.id}
                                item={item}
                                mode={mode}
                                onEnterScore={onEnterScore}
                                onWhatIfScoreChange={onWhatIfScoreChange}
                                showRequiredMarks={showRequiredMarks}
                                goal={goal}
                                requiredRaw={req?.requiredRawScore ?? null}
                                requiredPct={req?.requiredPctOnItem ?? null}
                            />
                        );
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={1} className={styles.footerLeft}>
                            <span className="text-body1-bold text-primary">Graded assessment:</span>
                            <span className="text-body1">
                                {gradedCount} / {items.length}
                            </span>
                        </TableCell>
                        <TableCell colSpan={2} className={styles.footerRight}>
                            <div className={styles.footerRight}>
                                <span className="text-body1-bold text-primary">Total weight:</span>
                                <span className="text-body1 text-primary">
                                    { overallPercent(items).toFixed(1)} /{" "}                                </span>
                                <span className="text-body1-bold primary-light">{totalWeight.toFixed(1)} %</span>
                                {(totalWeight < 100 - EPS) && (
                                    <span className={styles.weightWarning}>
                                        Total weight is not 100%. <br></br>
                                        Please add all assessments for accurate calculation.
                                    </span>
                                )}
                            </div>   
                        </TableCell>
                        <TableCell colSpan={2}>
                            {goalUnreachable && (
                                <span className={styles.goalWarn}>
                                    Goal unreachable - adjust your goal.
                                </span>
                            )}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>          
        </div>
    );
}
