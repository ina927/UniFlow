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
import { TermEntity } from "@/entities";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

interface ManageTermModalProps {
  className?: string;
  terms: TermEntity[];
}

export const ManageTermModal = (props: ManageTermModalProps) => {
  const [open, setOpen] = useState(false);
  const { terms } = props;

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
        <DialogContent className="w-auto max-w-fit min-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Term</DialogTitle>
          </DialogHeader>

          <div className="rounded-md border mt-2 mb-2">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon">
                <Image src={SETTINGS.src} alt="Settings" width={20} height={20} />
              </Button>

              <Label>Add Term</Label>
              <Table>
                <TableRow>
                  <TableCell colSpan={5}>
                    <form className="flex items-center gap-2">
                      <Input type="text" placeholder="Term Title" className="w-[150px]" />
                      <Input type="number" placeholder="Academic Year" className="w-[60px]" />
                      <Input type="date" placeholder="Start Date" />
                      <Input type="date" placeholder="End Date" />
                      <Button variant="default" size="icon">
                        Add
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              </Table>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Title</TableHead>
                  <TableHead className="max-w-[60px]">Academic Year</TableHead>
                  <TableHead className="min-w-[100px]">Start Date</TableHead>
                  <TableHead className="min-w-[100px]">End Date</TableHead>
                  <TableHead className="min-w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {terms?.map((term) => (
                  <TableRow key={term.id}>
                    <TableCell className="font-bold">{term.title}</TableCell>
                    <TableCell>{term.academicYear}</TableCell>
                    <TableCell>{term.startDate ? new Date(term.startDate).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{term.endDate ? new Date(term.endDate).toLocaleDateString() : "-"}</TableCell>
                    <TableCell className="text-right">⋮</TableCell>
                  </TableRow>
                ))}
              </TableBody>              
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
