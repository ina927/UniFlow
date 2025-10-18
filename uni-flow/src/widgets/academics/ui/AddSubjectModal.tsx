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
import { useAcademicStore } from "@/shared/stores";
import { createSubject } from "@/features/academics";
import { CreateSubjectDto } from "@/entities";

interface Props {
  className?: string;
  refetch: () => void;
}

export function AddSubjectModal(props: Props) {
  const { terms } = useAcademicStore();
  const { refetch } = props;

  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm<CreateSubjectDto>();

  const onSubmit = async (data: CreateSubjectDto) => {
    try {
      if (data.credits < 0) {
        throw new Error("Credit point must be greater than 0");
      }

      await createSubject(data);
      reset();
      setOpen(false);
      refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create subject");
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>+ Add Subject</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl" aria-describedby="Add subject details">
          <DialogHeader>
            <DialogTitle>Add Subject</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <Label>Term *</Label>
                <Select onValueChange={(v) => setValue("termId", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    {terms?.map((term) => (
                      <SelectItem key={term.id} value={term.id}>
                        {term.title}
                      </SelectItem>
                    ))}
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
                  {...register("credits", { required: true, valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <Label>Goal Grade</Label>
                <Select onValueChange={(v) => {
                  const gradeMap: { [key: string]: number } = { 'HD': 85, 'D': 75, 'C': 65, 'P': 50 };
                  setValue("goalGrade", gradeMap[v]);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HD">HD</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="P">P</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tutor</Label>
                <Input placeholder="Enter name" {...register("labTutorName")} />
                <Input placeholder="Enter email" className="mt-2" {...register("labTutorEmail")} />
              </div>

              <div>
                <Label>Coordinator</Label>
                <Input placeholder="Enter name" className="mt-2" {...register("coordinatorName")} />
                <Input placeholder="Enter email" className="mt-2" {...register("coordinatorEmail")} />
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
