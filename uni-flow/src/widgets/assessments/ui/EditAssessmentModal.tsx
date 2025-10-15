"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { AssessmentForm, AssessmentFormHandle } from "@/features/assessments/ui";
import { useUpdateAssessment } from "@/features/assessments/hooks/useAssessmentsQuery";
import type { Assessment } from "@/entities/assessments/entities";
import styles from "./AddAssessmentModal.module.css"

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  subjectId: string;
  initial: Assessment; // prefilled data
  currentTotalWeight: number;
};

export const EditAssessmentModal = ({ open, onOpenChange, subjectId, initial, currentTotalWeight }: Props) => {
  const ref = React.useRef<AssessmentFormHandle>(null);
  const [canSave, setCanSave] = React.useState(false); 
  const update = useUpdateAssessment(subjectId);
  const [err, setErr] = React.useState<string | null>(null);
  const EPS = 1e-6;

  // Save handler: read DTO from form and patch selected assessment
  const onSave = () => {
    const dto = ref.current?.getDto();
    if (!dto) return;
    const safeCurrent = Number.isFinite(currentTotalWeight) ? currentTotalWeight : 0;
    const base = safeCurrent - (Number(initial.weight) || 0);    const nextTotal = base + (dto.weight ?? 0);
    if (nextTotal > 100 + EPS) {
      setErr(`Saving this will make total weight ${nextTotal.toFixed(1)}% (>100). Please reduce some weights.`);
      return;
    }
    update.mutate(
      { id: initial.id, dto },
      { onSuccess: () => { setErr(null); onOpenChange(false); } }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.modal}>
        <DialogHeader>
          <DialogTitle>Edit Assessment</DialogTitle>
        </DialogHeader>
        {err && (
           <div className="mb-3 text-body1 text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-3">
             {err}
           </div>
         )}
        <AssessmentForm 
            ref={ref} 
            subjectId={subjectId} 
            initial={initial} 
            onValidityChange={setCanSave}
        />
        <DialogFooter className={styles.footer}>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={update.isPending}>
            Cancel
          </Button>
          <Button onClick={onSave} className={styles.saveBtn} disabled={!canSave || update.isPending}>
            {update.isPending ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
