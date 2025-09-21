"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { AssessmentForm, AssessmentFormHandle } from "@/features/assessments/ui";
import { useUpdateAssessment } from "@/features/assessments/hooks/useAssessmentsQuery";
import type { Assessment } from "@/entities/assessments";
import styles from "./AddAssessmentModal.module.css"

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  subjectId: string;
  initial: Assessment; // prefilled data
};

export const EditAssessmentModal = ({ open, onOpenChange, subjectId, initial }: Props) => {
  const ref = React.useRef<AssessmentFormHandle>(null);
  const [canSave, setCanSave] = React.useState(false); 
  const update = useUpdateAssessment(subjectId);

  // Save handler: read DTO from form and patch selected assessment
  const onSave = () => {
    const dto = ref.current?.getDto();
    if (!dto) return;
    update.mutate(
      { id: initial.id, dto },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.modal}>
        <DialogHeader>
          <DialogTitle>Edit Assessment</DialogTitle>
        </DialogHeader>

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
