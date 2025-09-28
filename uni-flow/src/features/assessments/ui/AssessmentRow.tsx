"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/widgets/assessments/AssessmentTable.module.css";
import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Assessment, Grade } from "@/entities/assessments";
import { isGraded, weightedContribution } from "@/features/assessments/ui/grade-logics";

type Props = {
    item: Assessment;
    mode: "view" | "whatif";
    showRequiredMarks?: boolean;
    goal?: Grade; 
    onEnterScore?: (id: string) => void;
    onWhatIfScoreChange?: (id: string, value: number | null) => void;
    requiredRaw?: number | null;
    requiredPct?: number | null;
};

export default function AssessmentRow({
    item,
    mode,
    showRequiredMarks = false,
    goal = Grade.HD,
    onEnterScore,
    onWhatIfScoreChange,
    requiredRaw = null,
    requiredPct = null,
}: Props) {
    const router = useRouter();

    const goDetail = () => {
        const q = new URLSearchParams({ subjectId: item.subjectId }).toString();
        router.push(`/assessments/${item.id}?${q}`);
    };

    // derived values for display
    const graded = isGraded(item); // score present & maxScore > 0
    const currentWeightPct = graded ? weightedContribution(item) : null;

    // --- What-If input state (local draft) ---
    const initialStr = item.score != null ? String(to2(item.score)) : ""; // prefill when score exists
    const [draft, setDraft] = useState<string>(initialStr);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Sync draft when row is re-rendered with different score or mode toggles
        setDraft(item.score != null ? String(to2(item.score)) : "");
        setError(null);
    }, [item.id, item.score, mode]);
    
    // Allow typing (including transient states like "1.")
    const onChangeDraft = (v: string) => {
        const ok = /^(\d+(\.\d{0,2})?)?$/.test(v);
        if (!ok) return;
        setDraft(v);
    };

    // Commit helper: parse, clamp to 2 decimals, validate 0..max
    const commit = () => {
        const t = draft.trim();

        if (t === "") {
            onWhatIfScoreChange?.(item.id, null);
            setDraft("");
            return;
        }

        const num = Number(t);

        let v: number;
        if (!Number.isFinite(num) || num < 0 || num > item.maxScore) {
            v = 0;
        } else {
            v = Math.round(num * 100) / 100;
        }

        onWhatIfScoreChange?.(item.id, v);
        setDraft(String(v));
    };

    // Keyboard UX: Enter to commit, Esc to revert
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.currentTarget.blur();
        } else if (e.key === "Escape") {
            setDraft(initialStr);
            setError(null);
            e.currentTarget.blur();
        }
    };

    return(
        <TableRow className={styles.row} aria-label={`assessment row ${item.title}`}onClick={goDetail}>
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

            {/* Score (view vs what-if) */}
            <TableCell className={styles.colScore}>
                {mode === "whatif" ? (
                    <div className={styles.scoreBlock}>
                        <div className="flex items-center gap-1">
                        <Input
                            value={draft}
                            onChange={(e) => onChangeDraft(e.target.value)}
                            onBlur={commit}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={onKeyDown}
                            inputMode="decimal"
                            placeholder={item.score == null ? "" : undefined}
                            aria-invalid={!!error}
                            aria-describedby={error ? `err-${item.id}` : undefined}
                            className="w-[50px] h-[28px] px-2 text-right"
                        />
                        <span style={{ display: "inline-block", width: "4.5ch", whiteSpace: "nowrap" }} 
                            className="text-body1 text-tertiary">/ {fmt(item.maxScore)}</span>
                        </div>
                        {error && (
                        <span id={`err-${item.id}`} className={styles.requiredNote}>
                            {error}
                        </span>
                        )}
                        {showRequiredMarks && !graded && requiredRaw !== null && Number.isFinite(requiredRaw) && (
                        <span className={styles.requiredNote}>
                            {requiredPct! > 100 ? "Goal unreachable" : `${fmt(requiredRaw)} required`}
                        </span>
                        )}
                    </div>
                    ) : (
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
                )}
            </TableCell>
            
            {/* Enter Score Btn */}
            <TableCell className={styles.colAction}>
                <button
                    type="button"
                    className={`${styles.enterBtn} ${mode === "whatif" ? styles.enterBtnWhatIf : ""}`}
                    onClick={(e) => { 
                        e.stopPropagation();
                        onEnterScore?.(item.id);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    aria-label={`enter or edit score for ${item.title}`}
                    disabled={mode === "whatif"}
                    aria-disabled={mode === "whatif"}
                    title={mode === "whatif" ? "Disabled in What-If mode" : "Enter Score"}
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
/** Clamp to 2 decimal places */
function to2(n: number) { return Math.round(n * 100) / 100; }

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