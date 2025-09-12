"use client";

import styles from "@/widgets/assessments/AssessmentTable.module.css";
import { TableRow, TableCell } from "@/components/ui/table";
import { Assessment } from "@/entities/assessments";
import { Grade } from "@/entities/assessments";   
import {
    isGraded,
    weightedContribution,  
} from "@/entities/assessments";

type Props = {
    item: Assessment;
    mode: "view" | "whatif";
    showRequiredMarks?: boolean;
    goal?: Grade; 
    onEnterScore?: (id: string) => void;
    requiredRaw?: number | null;
    requiredPct?: number | null;
};

export default function AssessmentRow({
    item,
    mode,
    showRequiredMarks = false,
    goal = Grade.HD,
    onEnterScore,
    requiredRaw = null,
    requiredPct = null,
}: Props) {
    // derived values for display
    const graded = isGraded(item); // score present & maxScore > 0
    const currentWeightPct = graded ? weightedContribution(item) : null;

    return(
        <TableRow className={styles.row} aria-label={`assessment row ${item.title}`}>
            {/* Title + (type) */}
            <TableCell className={styles.colTitle}>
                <div className={styles.titleBlock}>
                    <span className="text-body1-semibold text-primary underline">
                        {item.title}
                    </span>
                    <span className="text-body1 text-tertiary">
                        ({item.type})
                    </span>
                </div>
            </TableCell>

            {/* Due Date */}
            <TableCell className={styles.colDue}>
                <span className="text-body1 text-primary">
                    {formatDue(item.dueDate)}
                </span>
            </TableCell>

            {/* Weight */}
            <TableCell className={styles.colWeight}>
                <span className="text-body1 text-primary">
                    {currentWeightPct === null ? "-" : pct(currentWeightPct)}
                    {" / "}
                    <span className="text-body1-bold primary-light">
                        {pct(item.weight)}
                    </span>
                </span>
            </TableCell>

           {/* Score + Required */}
            <TableCell className={styles.colScore}>
                <div className={styles.scoreBlock}>
                    <span className="text-body1 text-primary">
                        {graded ? fmt(item.score!) : "-"} / {fmt(item.maxScore)}
                    </span>
                    {showRequiredMarks && !graded && requiredRaw !== null && Number.isFinite(requiredRaw) && (
                        <span className={styles.requiredNote}>
                          {requiredPct! > 100 ? "Goal unreachable" : `${fmt(requiredRaw)} required`}
                        </span>
                    )}
                </div>
            </TableCell>
            
            {/* Enter Score Btn */}
            <TableCell className={styles.colAction}>
                <button
                    type="button"
                    className={styles.enterBtn}
                    onClick={() => onEnterScore?.(item.id)}
                    aria-label={`enter or edit score for ${item.title}`}
                >
                    Enter Score
                </button>
            </TableCell>
        </TableRow>
    );
}

/** Format numbers: integer or 1 decimal place */
function fmt(n: number) {
  return Number.isInteger(n) ? n : Number(n.toFixed(1));
}
/** Format percentage with 1 decimal (e.g., 19.8%) */
function pct(n: number) {
  const val = Number.isInteger(n) ? n : Number(n.toFixed(1));
  return `${val} %`;
}
function formatDue(input?: string) {
  if (!input) return "—";

  // try to parse
  const d = new Date(input);
  if (isNaN(d.getTime())) return input;

  const hasTime = /T\d{2}:\d{2}/.test(input);

  if (!hasTime) {
    // date only → "3 Sep"
    const parts = new Intl.DateTimeFormat("en-AU", {
      day: "numeric",
      month: "short",
      timeZone: "Australia/Sydney",
    }).formatToParts(d);

    const day = parts.find(p => p.type === "day")?.value ?? "";
    const mon = parts.find(p => p.type === "month")?.value ?? "";
    return `${day} ${mon}`;
  }

  // date + time → "3 Sep 23:59"
  const parts = new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Australia/Sydney",
  }).formatToParts(d);

  const day = parts.find(p => p.type === "day")?.value ?? "";
  const mon = parts.find(p => p.type === "month")?.value ?? "";
  const hh  = parts.find(p => p.type === "hour")?.value ?? "00";
  const mm  = parts.find(p => p.type === "minute")?.value ?? "00";

  return `${day} ${mon} ${hh}:${mm}`;
}