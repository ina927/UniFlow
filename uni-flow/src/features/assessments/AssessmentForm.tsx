"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { AssessmentType } from "@/entities/assessments";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";

import styles from "@/widgets/assessments/AddAssessmentModal.module.css";
import { Calendar24 } from "@/components/ui/calendar24";

export default function AssessmentForm() {
    const [title, setTitle] = React.useState("");
    const [type, setType] = React.useState<string | undefined>();
    const [weight, setWeight] = React.useState<string>("");
    const [maxScore, setMaxScore] = React.useState<string>("");
    const [dueDate, setDueDate] = React.useState<Date | undefined>();
    const [description, setDescription] = React.useState("");

    const handleSubmitPreview = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ title, type, weight, maxScore, dueDate, description });
    };

    return (
        <form className={styles.formGrid} onSubmit={handleSubmitPreview}>
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
        <Calendar24/>
        </div>

      {/* Description */}
      <div className={styles.formItemFull}>
        <Label className={styles.label}>Description / memo</Label>
        <Textarea placeholder="Add description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      {/* <div className={styles.formActions}>
        <Button type="submit">Save</Button>
      </div> */}
    </form>
  );
}
