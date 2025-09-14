"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/widgets/common/ui/ConfirmDialog";

type EnterScoreModalProps = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    assessment: {
            id: string;
            title: string;
            maxScore: number;
            score?: number | null;
    };
    onSave: (id: string, nextScore: number) => void;
    onClear: (id: string) => void;
};

/**
 * EnterScoreModal
 * Modal dialog that allows the user to enter or update a score for an assessment.
 */
export default function EnterScoreModal({
    open,
    onOpenChange,
    assessment,
    onSave,
    onClear
}: EnterScoreModalProps) {
    const { id, title, maxScore, score } = assessment;

    // Controlled input state (string) for user typing
    const [valueStr, setValueStr] = React.useState<string>(
        score != null ? String(score) : ""
    );

    // Reset field when modal opens with new score
    React.useEffect(() => {
        if (open) setValueStr(score != null ? String(score) : "");
    }, [open, score]);

    // Parse and validate numeric input
    const trimmed = valueStr.trim();
    const parsed = trimmed === "" ? NaN : Number(trimmed);
    const valueNum = Number.isFinite(parsed) ? (parsed as number) : null;

    const withinRange = valueNum !== null && valueNum >= 0 && valueNum <= maxScore;
    const isSame = (score ?? null) === valueNum;

    let error: string | null = null;
    if (trimmed !== "" && (!Number.isFinite(parsed) || !withinRange)) {
        error = `Score must be between ${0} and ${maxScore}.`;
    } 

    // show when there is an existing score
    const canMarkUngraded = (score ?? null) !== null;
    // state for the confirm dialog that clears the score
    const [clearConfirmOpen, setClearConfirmOpen] = React.useState(false);
    const handleClear = () => setClearConfirmOpen(true);
    const confirmClear = () => {
        setClearConfirmOpen(false);
        onClear(id);
        onOpenChange(false);
    };

    // Save button is enabled only when input is valid and different from previous
    const canSave =
        trimmed !== "" && error === null && valueNum !== null && !isSame;

    // State for confirmation modal when overriding existing score
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const handlePrimarySave = () => {
        if ((score ?? null) !== null && canSave) {
            setConfirmOpen(true);
        } else if (canSave && valueNum !== null) {
            onSave(id, valueNum);
            onOpenChange(false);
        }
    };

    const handleConfirm = () => {
        setConfirmOpen(false);
        if (valueNum !== null) {
            onSave(id, valueNum);
            onOpenChange(false);
        }
    };

    const placeholder =
        score == null ? `Enter score (max: ${maxScore})` : undefined;

    return (
        <>
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[420px]">
            <DialogHeader>
                <DialogTitle className="text-title3-bold">{title}</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-2">
                <label htmlFor="score-input" className="text-body1-bold text-primary">
                    Score <span className="text-body1">(max:  {maxScore})</span>
                </label>
                <Input
                    id="score-input"
                    inputMode="decimal"
                    value={valueStr}
                    onChange={(e) => setValueStr(e.target.value)}
                    placeholder={placeholder}
                    aria-invalid={error ? true : false}
                    aria-describedby={error ? "score-error" : undefined}
                />
                {error && (
                    <p
                        id="score-error"
                        className="text-[13px] leading-tight text-[var(--destructive)]"
                    >
                        {error}
                    </p>
                )}
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={handleClear} disabled={!canMarkUngraded}>
                    Mark as Ungraded
                </Button>
                <Button onClick={handlePrimarySave} disabled={!canSave}>
                    Save
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Reusable confirmation modal */}
        <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Change confirmation"
            message={`Are you sure you want to change your score: ${score ?? "—"} → ${
            valueNum ?? "—"
            }?`}
            onConfirm={handleConfirm}
        />
        {/* confirm for clearing the score */}
        <ConfirmDialog
            open={clearConfirmOpen}
            onOpenChange={setClearConfirmOpen}
            title="Remove score?"
            message="This will clear the current score and mark this assessment as ungraded. You can enter a score later."
            confirmText="Yes, remove it"
            onConfirm={confirmClear}
        />
        </>
    );
}
