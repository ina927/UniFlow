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
import { Label } from "@/shared/ui/label";
import { createTerm } from "@/features/academics";
import { CreateTermDto } from "@/entities";
import { useAcademicStore } from "@/shared/stores";

interface Props {
  className?: string;
  refetch: () => void;
}

export function AddTermModal(props: Props) {
  const { refetch } = props;
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<CreateTermDto>();
  const { academicCourseId } = useAcademicStore();

  const onSubmit = async (data: Omit<CreateTermDto, "academicCourseId">) => {
    try {
      await createTerm({ term: data, academicCourseId: academicCourseId! });
      reset();
      refetch();
      setOpen(false);
    } catch (e) {
      console.error("create term failed", e);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>+ Add Term</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl" aria-describedby="Add term details">
          <DialogHeader>
            <DialogTitle>Add Term</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input placeholder="Enter term title" {...register("title", { required: true })} />
              </div>

              <div>
                <Label>Academic Year *</Label>
                <Input placeholder="Enter academic year" {...register("academicYear", { required: true })} />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <Label>Start Date *</Label>
                <Input type="date" placeholder="Enter start date" {...register("startDate", { required: true })} />
              </div>

              <div>
                <Label>End Date *</Label>
                <Input type="date" placeholder="Enter end date" {...register("endDate", { required: true })} />
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
