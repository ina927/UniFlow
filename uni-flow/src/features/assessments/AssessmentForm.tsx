"use client";

import * as React from "react";
import { AssessmentType } from "@/entities/assessments";
import type { CreateAssessmentDto } from "@/entities/assessments";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";

import styles from "@/widgets/assessments/AddAssessmentModal.module.css";
import { Calendar24 } from "@/components/ui/calendar24";

export type AssessmentFormHandle = {
  getDto: () => CreateAssessmentDto | null;
  reset: () => void;
};

type Props = { subjectId: string };

const AssessmentForm = React.forwardRef<AssessmentFormHandle, Props>(({ subjectId }, ref) => {
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState<string>("");
  const [weight, setWeight] = React.useState<string>("");
  const [maxScore, setMaxScore] = React.useState<string>("");
  const [dueLocal, setDueLocal] = React.useState<Date | null>(null);
  const [description, setDescription] = React.useState("");

  React.useImperativeHandle(ref, () => ({
    getDto() {
      if (!title.trim() || !type || !weight || !maxScore || !dueLocal) return null;
      const w = Number(weight), m = Number(maxScore);
      if (!Number.isFinite(w) || !Number.isFinite(m)) return null;
      if (!dueLocal) return null;
      const dueISO = dueLocal.toISOString();
      return {
        subjectId,
        title: title.trim(),
        type: type as AssessmentType,
        weight: w,
        maxScore: m,
        dueDate: dueISO,
        description: description.trim() || undefined,
      };
    },
    reset() {
      setTitle(""); setType(""); setWeight(""); setMaxScore(""); setDueLocal(null); setDescription("");
    },
  }));
  return (
      <form className={styles.formGrid} onSubmit={(e)=>e.preventDefault()}>
      {/* Title */}
      <div className={styles.formItem}>
          <Label className={styles.label}>Title *</Label>
          <Input placeholder="Enter assessment title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      {/* Weight */}
      <div className={styles.formItem}>
          <Label className={styles.label}>Weight *</Label>
          <Input type="number" inputMode="decimal" placeholder="Enter weight" value={weight} onChange={(e) => setWeight(e.target.value)} />
      </div>

      {/* Type */}
      <div className={styles.formItem}>
          <Label className={styles.label}>Type *</Label>
          <Select value={type} onValueChange={setType}>
          <SelectTrigger>
              <SelectValue placeholder="Select assessment type" />
          </SelectTrigger>
          <SelectContent>
              {Object.values(AssessmentType).map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
          </SelectContent>
          </Select>
      </div>

      {/* Max score */}
      <div className={styles.formItem}>
          <Label className={styles.label}>Max score *</Label>
          <Input type="number" inputMode="decimal" placeholder="Enter max score" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} />
      </div>

      {/* Due (date + time) */}
      <div className={styles.formItem}>
      <Label className={styles.label}>Due *</Label>
      <Calendar24 value={dueLocal ?? undefined} onChange={setDueLocal} />
      </div>

    {/* Description */}
    <div className={styles.formItemFull}>
      <Label className={styles.label}>Description / memo</Label>
      <Textarea placeholder="Add description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
    </div>
  </form>
);
});

AssessmentForm.displayName = "AssessmentForm";
export default AssessmentForm;
