"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { getSubjects, SubjectRow } from "@/features/academics";
import { AddSubjectModal } from "./AddSubjectModal";
import { EditSubjectModal } from "./EditSubjectModal";
import { useAcademicStore } from "@/shared/stores";
import { CreditViewer } from "@/features/academics/ui/CreditViewer";

interface Props {
  className?: string;
}

export const SubjectTable = (props: Props) => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const { academicCourseId, selectedTermId } = useAcademicStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["subjects", selectedTermId, academicCourseId],
    queryFn: () => getSubjects(academicCourseId!, selectedTermId ?? undefined),
    enabled: !!academicCourseId,
  });

  const subjects: SubjectRow[] = data?.data?.data || [];

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error!</div>

  const gotoAssessments = (subjectId: string) => {
    router.push(`/academic/assessments?subjectId=${subjectId}`);
  };

  const handleEditClick = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedSubjectId(null);
    refetch();
  };

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
              <TableHead className="text-left px-4 py-3">Code</TableHead>
              <TableHead className="text-left">Title</TableHead>
              <TableHead className="text-left">Credit</TableHead>
              <TableHead className="text-left">Term</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody className="px-4">
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell onClick={() => gotoAssessments(subject.id)} className="font-bold px-4 py-3 cursor-pointer">{subject.code}</TableCell>
                <TableCell onClick={() => gotoAssessments(subject.id)} className="cursor-pointer">{subject.title}</TableCell>
                <TableCell onClick={() => gotoAssessments(subject.id)} className="cursor-pointer">{subject.credits}</TableCell>
                <TableCell onClick={() => gotoAssessments(subject.id)} className="cursor-pointer">{subject.term.title}</TableCell>
                <TableCell className="text-right px-4 py-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(subject.id);
                    }}
                    className="hover:bg-transparent hover:text-primary p-1 h-auto cursor-pointer"
                  >
                    ⋮
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <CreditViewer subjects={subjects} />
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
      
      {/* 
        Note: The EditSubjectModal component doesn't exist yet.
        You'll need to create it similar to AddSubjectModal but for editing.
        For now, we'll just show a placeholder.
      */}
      {selectedSubjectId && (
        <div className={`fixed inset-0 bg-black/50 flex items-center justify-center ${isEditModalOpen ? 'block' : 'hidden'}`}>
          <EditSubjectModal 
            isOpen={isEditModalOpen}
            onClose={handleEditModalClose}
            subjectId={selectedSubjectId}
          />
        </div>
      )}
    </div>
  );
}
