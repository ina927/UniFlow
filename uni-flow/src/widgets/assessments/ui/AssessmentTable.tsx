"use client";
 
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/shared/ui";
import { AssessmentRow } from "@/features/assessments/ui";
import { Assessment } from "@/entities/assessments/entities";
import { overallPercent, requiredMarksPerRemaining, isGraded, neededToReach, remainingWeightSum } from "@/features/assessments/grade-logics";
import { Grade } from "@/entities/assessments/enums";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/shared/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    const PAGE_SIZE = 8;
    const [page, setPage] = useState(1);
    const totalPages = useMemo(
        () => Math.max(1, Math.ceil((items?.length ?? 0) / PAGE_SIZE)),
        [items, PAGE_SIZE]
    );
    const pagedItems = useMemo(() => {
        if (!items?.length) return [];
        const start = (page - 1) * PAGE_SIZE;
        return items.slice(start, start + PAGE_SIZE);
    }, [items, page, PAGE_SIZE]);
    useEffect(() => { setPage(1); }, [items]);

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
                    {pagedItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-20 text-center text-[--muted]">
                            No assessments have been added yet.                        
                        </TableCell>
                      </TableRow>
                    ) : (
                      pagedItems.map((item) => {
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
                      })
                    )}
                </TableBody>
                {items.length > 0 && (
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
                )}
            </Table>
            {items.length > 0 && (
                <div className="flex items-center justify-end gap-2 mt-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                >
                    <ChevronLeft size={16} />
                </Button>
                <span className="text-sm">Page {page} of {totalPages}</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                >
                    <ChevronRight size={16} />
                </Button>
                </div>
            )}
        </div>          
    );
}
