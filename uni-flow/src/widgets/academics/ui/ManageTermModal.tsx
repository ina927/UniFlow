"use client";

import { useState } from "react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { SETTINGS } from "@/shared/consts/images";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { useAcademicStore } from "@/shared/stores";
import { AddTermModal } from "./AddTermModal";
import { EditTermModal } from "./EditTermModal";

interface ManageTermModalProps {
  className?: string;
}

export const ManageTermModal = (props: ManageTermModalProps) => {
  const [open, setOpen] = useState(false);
  const { terms } = useAcademicStore();
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (termId: string) => {
    setSelectedTermId(termId);
    setIsEditModalOpen(true);
  }

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedTermId(null);
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Image
          src={SETTINGS.src}
          alt="Settings"
          width={20}
          height={20}
        />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-auto max-w-fit min-w-[760px]">
          <DialogHeader>
            <DialogTitle>Manage Term</DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-end">
            <AddTermModal />
          </div>

          <div className="rounded-md border mb-2 p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left px-4 py-3 min-w-[150px]">Title</TableHead>
                  <TableHead className="text-left min-w-[120px]">Academic Year</TableHead>
                  <TableHead className="text-left min-w-[100px]">Start Date</TableHead>
                  <TableHead className="text-left min-w-[100px]">End Date</TableHead>
                  <TableHead className="text-right min-w-[24px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {terms?.sort((a, b) => a.title.localeCompare(b.title)).map((term) => (
                  <TableRow key={term.id}>
                    <TableCell className="font-bold px-4 py-3">{term.title}</TableCell>
                    <TableCell>{term.academicYear}</TableCell>
                    <TableCell>{term.startDate ? new Date(term.startDate).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{term.endDate ? new Date(term.endDate).toLocaleDateString() : "-"}</TableCell>
                    <TableCell onClick={() => handleEdit(term.id)} className="text-right cursor-pointer px-4 py-3">⋮</TableCell>
                  </TableRow>
                ))}
              </TableBody>              
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {selectedTermId && (
        <div className={`fixed inset-0 bg-black/50 flex items-center justify-center ${isEditModalOpen ? 'block' : 'hidden'}`}>
          <EditTermModal 
            isOpen={isEditModalOpen}
            onClose={handleEditModalClose}
            termId={selectedTermId}
          />
        </div>
      )}
    </>
  );
}
