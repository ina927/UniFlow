"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AssessmentForm, { AssessmentFormHandle } from "@/features/assessments/ui/AssessmentForm";
import { useCreateAssessment } from "@/features/assessments/hooks/useAssessmentsQuery";
import styles from "./AddAssessmentModal.module.css";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  subjectId: string;
  currentTotalWeight: number;
};

export default function AddAssessmentModal({ open, onOpenChange, subjectId, currentTotalWeight }: Props) {  const formRef = React.useRef<AssessmentFormHandle>(null);
  const [canSave, setCanSave] = React.useState(false); 
  const create = useCreateAssessment(subjectId);
  const [err, setErr] = React.useState<string | null>(null);
  const EPS = 1e-6;

  const onSave = () => {
    const dto = formRef.current?.getDto();
    if (!dto) return;
    const nextTotal = currentTotalWeight + (dto.weight ?? 0);
    if (nextTotal > 100 + EPS){
      setErr(`Saving this will make total weight ${nextTotal.toFixed(1)}% (>100). Please reduce some weights.`);
      return;
    }
    create.mutate(dto, {
      onSuccess: () => {
        formRef.current?.reset();
        setErr(null);
        onOpenChange(false);
      },
      onError: (e) => {
        console.error("create assessment failed", e);
      },
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.modal}>
        <DialogHeader>
          <DialogTitle className="text-title2-bold">Add Assessment</DialogTitle>
        </DialogHeader>
        {err && (
           <div className="mb-3 text-body1 text-destructive bg-destructive/10 border border-destructive/30 rounded-md p-3">
             {err}
           </div>
         )}
        <AssessmentForm ref={formRef} subjectId={subjectId} onValidityChange={setCanSave} />

        <DialogFooter className={styles.footer}>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={create.isPending}>
            Discard
          </Button>
          <Button onClick={onSave} className={styles.saveBtn} disabled={create.isPending || !canSave}>
            {create.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
