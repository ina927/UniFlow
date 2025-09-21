"use client";

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { getTerms } from '@/features/academics';
import { TermEntity } from '@/entities';
import { useAcademicStore } from '@/shared/stores';
import { ManageTermModal } from './ManageTermModal';

interface TermSelectorProps {
  className?: string;
  academicCourseId: string;
}

export const TermSelector = (props: TermSelectorProps) => {
  const { academicCourseId } = props;
  const [placeholderText, setPlaceholderText] = useState("Select Term");
  const { selectedTermId, setSelectedTermId } = useAcademicStore();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["terms", academicCourseId],
    queryFn: () => getTerms(academicCourseId),
    enabled: !!academicCourseId,
  });

  const terms: TermEntity[] = data?.data?.data;

  useEffect(() => {
    if (isLoading) {
      setPlaceholderText("Loading...");
    } else if (isError) {
      setPlaceholderText("Failed to load terms");
      setSelectedTermId(null);
    } else if (!terms || terms.length === 0) {
      setPlaceholderText("No Terms Found");
      setSelectedTermId(null);
    } else {
      setPlaceholderText("Select Term");
    }
  }, [terms, isError, isLoading, setSelectedTermId]);

  return (
    <div className={clsx(props.className, "flex items-center gap-2")}>
      <label className="text-title3">Term</label>
      <Select 
        onValueChange={setSelectedTermId} 
        value={selectedTermId || undefined}
        disabled={isLoading || isError || !terms || terms.length === 0}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={placeholderText} />
        </SelectTrigger>
        <SelectContent>
          {terms?.map((term) => (
            <SelectItem key={term.id} value={term.id}>
              {term.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ManageTermModal terms={terms} />
    </div>
  );
};
