"use client";

import { useEffect, useMemo, useState } from "react";
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
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Search } from "lucide-react";
import assessStyles from "@/widgets/assessments/ui/AssessmentTable.module.css";
import styles from "./SubjectTable.module.css";

interface Props {
  className?: string;
}

export const SubjectTable = (props: Props) => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const PAGE_SIZE = 8;
  const { academicCourseId, selectedTermId } = useAcademicStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["subjects", selectedTermId, academicCourseId],
    queryFn: () => getSubjects(academicCourseId!, selectedTermId ?? undefined),
    enabled: !!academicCourseId,
  });

  const subjects: SubjectRow[] = data?.data?.data || [];

  const norm = (s?: string) => (s ?? "").toLowerCase().trim();

  const filtered = useMemo(() => {
    if (!subjects.length) return [];
    const needle = norm(q);
    if (!needle) return subjects;
    return subjects.filter((s) => {
      const code = norm(s.code);
      const title = norm(s.title);
      const termTitle = norm(s.term?.title);
      return code.includes(needle) || title.includes(needle) || termTitle.includes(needle);
    });
  }, [subjects, q]);

  const filteredSorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const yearA = a.term?.academicYear ?? 0;
      const yearB = b.term?.academicYear ?? 0;

      if (yearA !== yearB) return yearB - yearA;

      const titleA = a.term?.title?.toLowerCase() ?? "";
      const titleB = b.term?.title?.toLowerCase() ?? "";
      return titleB.localeCompare(titleA);
    });
  }, [filtered]);

  const totalPages = useMemo(() => {
    if (!filteredSorted.length) return 1;
    return Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  }, [filteredSorted, PAGE_SIZE]);

  const pagedSubjects = useMemo(() => {
    if (!filteredSorted.length) return [];
    const start = (page - 1) * PAGE_SIZE;
    return filteredSorted.slice(start, start + PAGE_SIZE);
  }, [filteredSorted, page, PAGE_SIZE]);

  useEffect(() => {
    setPage(1);
  }, [q]);


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
    <div className="w-[80%]">
      

      <div className={assessStyles.wrapper}>
        <div className="flex items-center justify-between gap-3 pt-3 mb-4">
          <div className="flex items-center gap-2">
            <label className='text-title3-bold pl-2 mr-4'>Subject</label>
            <div className="relative w-full max-w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--muted]" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search subjects..."
                className="pl-10 h-10 w-[220px]"
              />
          </div>
          </div>
          <div className="flex justify-end">
            <AddSubjectModal refetch={refetch} />
          </div>
        </div>
        <Table className='mt-6'>
          <TableHeader>
            <TableRow className={assessStyles.headerRow}>
              <TableHead className={styles.colCode}>Code</TableHead>
              <TableHead className={styles.colTitle}>Subject</TableHead>
              <TableHead className={styles.colCredit}>Credit</TableHead>
              <TableHead className={styles.colTerm}>Term</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedSubjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-12 text-center">
                  No subjects found
                </TableCell>
              </TableRow>
            ) : (
              pagedSubjects.map((subject) => (
              <TableRow key={subject.id} className={assessStyles.row}>
                <TableCell onClick={() => gotoAssessments(subject.id)} className={`${styles.colCode} cursor-pointer`}>
                  {subject.code}
                </TableCell>
                <TableCell onClick={() => gotoAssessments(subject.id)} className={`${styles.colTitle} cursor-pointer`}>
                  {subject.title}
                </TableCell>
                <TableCell onClick={() => gotoAssessments(subject.id)} className={`${styles.colCredit} cursor-pointer`}>
                  {subject.credits}
                </TableCell>
                <TableCell onClick={() => gotoAssessments(subject.id)} className={`${styles.colTerm} cursor-pointer`}>
                  {subject.term.title}  {subject.term.academicYear }
                </TableCell>
                <TableCell className={styles.colAction}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(subject.id);
                    }}
                    className="hover:bg-transparent hover:text-primary p-1 h-auto cursor-pointer"
                  >
                    <MoreVertical size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
        <div className="border-t-2 border-[--border] mb-2" />
      </div>

      <div className="flex items-center justify-between text-sm">
        <CreditViewer subjects={subjects} />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            <ChevronLeft size={16} />
          </Button>
          <span>Page {page} of {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
      
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
