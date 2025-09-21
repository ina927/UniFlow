"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { AssessmentForm, AssessmentFormHandle } from "@/features/assessments/ui/AssessmentForm";
import { useCreateAssessment } from "@/features/assessments/hooks/useAssessmentsQuery";
import styles from "./AddAssessmentModal.module.css";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  subjectId: string;
};

export const AddAssessmentModal = ({ open, onOpenChange, subjectId }: Props) => {
  const formRef = React.useRef<AssessmentFormHandle>(null);
  const [canSave, setCanSave] = React.useState(false); 
  const create = useCreateAssessment(subjectId);

  const onSave = () => {
    const dto = formRef.current?.getDto();
    if (!dto) return;
    create.mutate(dto, {
      onSuccess: () => {
        formRef.current?.reset();
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
