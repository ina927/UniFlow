"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Label } from "@/shared/ui/label";

type FormValues = {
  term: string;
  code: string;
  title: string;
  credit: number;
  goalGrade: string;
  tutorName?: string;
  tutorEmail?: string;
  coordinatorName?: string;
  coordinatorEmail?: string;
};

export function AddSubjectModal() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    setOpen(false);
    reset();
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>+ Add Subject</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Subject</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <Label>Term *</Label>
                <Select onValueChange={(v) => setValue("term", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spring-2025">Spring 2025</SelectItem>
                    <SelectItem value="autumn-2025">Autumn 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Code *</Label>
                <Input placeholder="Enter subject code" {...register("code", { required: true })} />
              </div>

              <div>
                <Label>Title *</Label>
                <Input placeholder="Enter subject name" {...register("title", { required: true })} />
              </div>

              <div>
                <Label>Credit *</Label>
                <Input
                  type="number"
                  placeholder="Enter credit point"
                  {...register("credit", { required: true, valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <Label>Goal Grade</Label>
                <Select onValueChange={(v) => setValue("goalGrade", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HD">HD</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="P">P</SelectItem>
                    <SelectItem value="F">F</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Instructor</Label>
                <Input placeholder="Enter tutor name" {...register("tutorName")} />
                <Input placeholder="Enter tutor email" className="mt-2" {...register("tutorEmail")} />
                <Input placeholder="Enter coordinator name" className="mt-2" {...register("coordinatorName")} />
                <Input placeholder="Enter coordinator email" className="mt-2" {...register("coordinatorEmail")} />
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="col-span-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Discard
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
