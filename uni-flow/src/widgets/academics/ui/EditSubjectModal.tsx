"use client";

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
import { deleteSubject, getSubject, updateSubject } from "@/features/academics";
import { useQuery } from "@tanstack/react-query";
import { UpdateSubjectDto } from "@/entities";

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  subjectId: string;
}

export function EditSubjectModal(props: Props) {
  const { isOpen, onClose, subjectId } = props;
  const { terms } = useAcademicStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["subject", subjectId],
    queryFn: () => getSubject(subjectId),
    enabled: !!subjectId,
    refetchOnMount: true,
  });

  const { register, handleSubmit, setValue, reset } = useForm<UpdateSubjectDto>();

  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>No data found</div>
  if (isError) return <div>Error!</div>

  const selectedSubject = data.data.data;

  const onSubmit = async (data: UpdateSubjectDto) => {
    try {
      await updateSubject(subjectId, data);
      reset();
      onClose();
    } catch (e) {
      console.error("update subject failed", e);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSubject(subjectId);
      onClose();
    } catch (e) {
      console.error("delete subject failed", e);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl" aria-describedby="Edit subject details">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <Label>Term *</Label>
                <Select onValueChange={(v) => setValue("termId", v)} defaultValue={terms?.find(t => t.title === selectedSubject.term?.title)?.id}>
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
                <Input defaultValue={selectedSubject.code} placeholder="Enter subject code" {...register("code", { required: true })} />
              </div>

              <div>
                <Label>Title *</Label>
                <Input defaultValue={selectedSubject.title} placeholder="Enter subject name" {...register("title", { required: true })} />
              </div>

              <div>
                <Label>Credit *</Label>
                <Input
                  type="number"
                  defaultValue={selectedSubject.credits}
                  placeholder="Enter credit point"
                  {...register("credits", { required: true, valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <Label>Goal Grade</Label>
                <Select 
                  onValueChange={(v) => {
                    const gradeMap: { [key: string]: number } = { 'HD': 85, 'D': 75, 'C': 65, 'P': 50 };
                    setValue("goalGrade", gradeMap[v]);
                  }}
                  defaultValue={(() => {
                    const gradeMap: { [key: number]: string } = { 85: 'HD', 75: 'D', 65: 'C', 50: 'P' };
                    return gradeMap[selectedSubject.goalGrade as keyof typeof gradeMap] || undefined;
                  })()}
                >
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
                <Input placeholder={selectedSubject.labTutorName || "Enter name"} {...register("labTutorName")} />
                <Input placeholder={selectedSubject.labTutorEmail || "Enter email"} className="mt-2" {...register("labTutorEmail")} />
              </div>

              <div>
                <Label>Coordinator</Label>
                <Input placeholder={selectedSubject.coordinatorName || "Enter name"} className="mt-2" {...register("coordinatorName")} />
                <Input placeholder={selectedSubject.coordinatorEmail || "Enter email"} className="mt-2" {...register("coordinatorEmail")} />
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="col-span-2">
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
