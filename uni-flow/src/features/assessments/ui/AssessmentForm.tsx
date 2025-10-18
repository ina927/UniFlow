"use client";

import * as React from "react";

import { Assessment } from "@/entities/assessments/entities";
import type { CreateAssessmentDto } from "@/entities/assessments/dto";
import { AssessmentType } from "@/entities/assessments/enums";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/shared/ui/select";
import { Calendar24 } from "@/shared/ui/calendar24";

import styles from "./AssessmentForm.module.css";

export type AssessmentFormHandle = {
  getDto: () => CreateAssessmentDto | null;
  reset: () => void;
};

const TYPE_ENTRIES = Object.entries(AssessmentType) as [string, string][];
const keyToLabel = (k: string): string =>
  TYPE_ENTRIES.find(([key]) => key === k)?.[1] ?? "";
const labelToKey = (lbl: string): string =>
  TYPE_ENTRIES.find(([, label]) => label === lbl)?.[0] ??
  (TYPE_ENTRIES.find(([, label]) => label.toLowerCase() === (lbl || "").toLowerCase())?.[0] ?? "");

type Props = { subjectId: string, initial?: Assessment, onValidityChange?: (ok: boolean) => void; };

export const AssessmentForm = React.forwardRef<AssessmentFormHandle, Props>(
  ({ subjectId, initial, onValidityChange }, ref) => {
  const [title, setTitle] = React.useState("");
  const [typeKey, setTypeKey] = React.useState<string | undefined>(() => labelToKey(String(initial?.type ?? "")) || undefined);
  const [weight, setWeight] = React.useState<string>("");
  const [maxScore, setMaxScore] = React.useState<string>("");
  const [dueLocal, setDueLocal] = React.useState<Date | null>(null);
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    if (!initial) return;
    setTitle(initial.title);
    setTypeKey(labelToKey(String(initial.type ?? "")) || undefined);
    console.log(typeKey);
    setWeight(String(initial.weight));
    setMaxScore(String(initial.maxScore));
    setDueLocal(initial.dueDate ? new Date(initial.dueDate) : null);
    setDescription(initial.description ?? "");
  }, [initial]);

  const isValid = React.useMemo(() => {
    const w = Number(weight), m = Number(maxScore);
    return (
      title.trim().length > 0 &&
      !!typeKey &&
      Number.isFinite(w) && w > 0 &&
      Number.isFinite(m) && m > 0 &&
      !!dueLocal
    );
  }, [title, typeKey, weight, maxScore, dueLocal]);

  React.useEffect(() => { onValidityChange?.(isValid); }, [isValid, onValidityChange]);

  React.useImperativeHandle(ref, () => ({
    getDto() {
      if (!isValid || !typeKey || !dueLocal) return null;
      const label = keyToLabel(typeKey);
      const w = Number(weight), m = Number(maxScore);
      if (!Number.isFinite(w) || !Number.isFinite(m)) return null;
      const dueISO = dueLocal.toISOString();
      return {
        subjectId,
        title: title.trim(),
        type: (label || typeKey) as unknown as AssessmentType,
        weight: w,
        maxScore: m,
        dueDate: dueISO,
        description: description.trim() || undefined,
      };
    },
    reset() {
      setTitle(""); setTypeKey(undefined); setWeight(""); setMaxScore(""); setDueLocal(null); setDescription("");
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
          <Select 
            key={initial?.id ?? "new"} 
            value={typeKey}
            onValueChange={setTypeKey}
          >          
            <SelectTrigger>
              <SelectValue placeholder="Select assessment type" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_ENTRIES.map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
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

    {!isValid && (
        <div className="sm:col-span-2 text-body1 text-destructive">
          Please fill all required fields.
        </div>
      )}
  </form>
);
});

AssessmentForm.displayName = "AssessmentForm";
