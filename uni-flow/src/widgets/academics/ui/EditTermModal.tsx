"use client";

import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

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
import { deleteTerm, getTerm, updateTerm } from "@/features/academics";
import { UpdateTermDto } from "@/entities";

interface Props {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  termId: string;
  refetch: () => void;
}

export function EditTermModal(props: Props) {
  const { isOpen, onClose, termId, refetch } = props;

  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["term", termId],
    queryFn: () => getTerm(termId),
    enabled: !!termId,
    refetchOnMount: true,
  });

  const { register, handleSubmit, reset } = useForm<UpdateTermDto>();
  
  useEffect(() => {
    if (data) {
      const term = data.data.data;
      reset({
        ...term,
        startDate: term.startDate ? new Date(term.startDate).toISOString().split('T')[0] : undefined,
        endDate: term.endDate ? new Date(term.endDate).toISOString().split('T')[0] : undefined
      });
    }
  }, [data, reset]);

  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>No data found</div>
  if (isError) return <div>Error!</div>

  const selectedTerm = data.data.data;

  const onSubmit = async (data: UpdateTermDto) => {
    try {
      await updateTerm(termId, data);
      await queryClient.invalidateQueries({ 
        queryKey: ['terms']
      });
      await queryClient.invalidateQueries({ 
        queryKey: ['subjects']
      });
      reset();
      refetch();
      onClose();
    } catch (e) {
      console.error("update term failed", e);
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteTerm(termId);

      if (result.statusCode === 500) {
        alert("There are subjects associated with this term. Please delete the subjects first.");
        return;
      }

      await queryClient.invalidateQueries({ 
        queryKey: ['terms']
      });
      await queryClient.invalidateQueries({ 
        queryKey: ['subjects']
      });
      refetch();
      onClose();
    } catch (e) {
      console.error("delete term failed", e);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl" aria-describedby="Edit term details">
          <DialogHeader>
            <DialogTitle>Edit Term</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input defaultValue={selectedTerm.title} placeholder="Enter term name" {...register("title", { required: true })} />
              </div>

              <div>
                <Label>Academic Year *</Label>
                <Input
                  type="number"
                  defaultValue={selectedTerm.academicYear}
                  placeholder="Enter academic year"
                  {...register("academicYear", { required: true, valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  placeholder="Enter start date"
                  {...register("startDate", { 
                    required: true,
                    valueAsDate: true
                  })}
                />
              </div>

              <div>
                <Label>End Date *</Label>
                <Input
                  type="date"
                  placeholder="Enter end date"
                  {...register("endDate", { 
                    required: true,
                    valueAsDate: true
                  })}
                />
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
