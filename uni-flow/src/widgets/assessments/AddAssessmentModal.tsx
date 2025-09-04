"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AssessmentForm from "@/features/assessments/AssessmentForm";
import styles from "./AddAssessmentModal.module.css";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function AddAssessmentModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.modal}>
        <DialogHeader>
          <DialogTitle className="text-title2-bold">Add Assessment</DialogTitle>
        </DialogHeader>

        <AssessmentForm />

        <DialogFooter className={styles.footer}>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Discard
          </Button>
          <Button onClick={() => onOpenChange(false)} className={styles.saveBtn}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
