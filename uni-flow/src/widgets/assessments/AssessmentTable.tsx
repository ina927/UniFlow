"use client";
 
import styles from "./AssessmentTable.module.css";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";
import AssessmentRow from "@/features/assessments/AssessmentRow";
import { Assessment, Grade } from "@/entities/assessments";
import { requiredOnSingleItemForGoal, isGraded } from "@/entities/assessments";

type Props = {
    items: Assessment[];
    mode: "view" | "whatif";
    onEnterScore?: (id: string) => void;
    showRequiredMarks?: boolean;
    goal?: Grade;
}

export default function AssessmentTable({ 
    items, mode, onEnterScore,
    showRequiredMarks = false,
    goal = Grade.HD,
    }: Props){
    const gradedCount = items.filter(i => i.score !== undefined && i.score !== null).length;
    const totalWeight = items.reduce((acc, it) => acc + (it.weight || 0), 0);

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
                        const req = !isGraded(item)
                            ? requiredOnSingleItemForGoal(items, item.id, goal)
                            : null;

                        return (
                        <AssessmentRow
                            key={item.id}
                            item={item}
                            mode={mode}
                            onEnterScore={onEnterScore}
                            showRequiredMarks={showRequiredMarks}
                            goal={goal}
                            requiredRaw={req?.requiredRawScore}
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
                                    {items.reduce((acc,it) => acc + (it.weight || 0), 0).toFixed(1)} / {" "}
                                </span>
                                <span className="text-body1-bold primary-light">{totalWeight.toFixed(1)} %</span>
                                {totalWeight !== 100 && (
                                    <span className={styles.weightWarning}>
                                        Total weight is not 100%. Please add all assessments for accurate calculation.
                                    </span>
                                )}
                            </div>   
                        </TableCell>
                        <TableCell colSpan={2}></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>          
        </div>
    );
}