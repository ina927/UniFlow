"use client";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { SubjectRow } from "@/features/academics";
import { AddSubjectModal } from "./AddSubjectModal";

const mockSubjects: SubjectRow[] = [
  { id: "1", code: "41026", title: "Advanced Software Development", credits: 6, term: "Spring 2025" },
  { id: "2", code: "41026", title: "Advanced Software Development", credits: 6, term: "Spring 2025" },
  { id: "3", code: "41026", title: "Advanced Software Development", credits: 6, term: "Spring 2025" },
  { id: "4", code: "41026", title: "Advanced Software Development", credits: 6, term: "July 2025" },
  { id: "5", code: "41026", title: "Advanced Software Development", credits: 6, term: "Autumn 2025" },
  { id: "6", code: "41026", title: "Advanced Software Development", credits: 6, term: "Autumn 2025" },
  { id: "7", code: "41026", title: "Advanced Software Development", credits: 6, term: "Autumn 2025" },
  { id: "8", code: "41026", title: "Advanced Software Development", credits: 6, term: "Autumn 2025" },
];

interface Props {
  className?: string;
}

export const SubjectTable = (props: Props) => {
  const [page, setPage] = useState(1);

  const subjects = mockSubjects;

  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);

  return (
    <div className="w-full mt-4">
      <div className="flex items-center justify-between">
        <label className="text-title3">Subject</label>
        <AddSubjectModal />
      </div>

      <div className="rounded-md border mt-2 mb-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>Term</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell className="font-bold">{subject.code}</TableCell>
                <TableCell>{subject.title}</TableCell>
                <TableCell>{subject.credits}</TableCell>
                <TableCell>{subject.term}</TableCell>
                <TableCell className="text-right">⋮</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <p>
          <span className="font-medium">total credit point:</span> {totalCredits} / 144
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((page) => Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Prev
          </Button>
          <span>Page {page} of 1</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((page) => page + 1)}
            disabled={page === 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
