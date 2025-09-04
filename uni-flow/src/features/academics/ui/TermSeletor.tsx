"use client";

import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';

import { Seletor } from '@/features/common';
import { getTerms } from '@/features/academics/api';
import { TermEntity } from '@/entities';
import { TERMS_QUERY_KEY } from '@/shared/consts';

interface Props {
  className?: string;
  selectedAcademicCourseId: string;
  selectedTerm: string;
  setSelectedTerm: (termId: string) => void;
}

export const TermSeletor = (props: Props) => { 
  const { selectedAcademicCourseId, selectedTerm, setSelectedTerm } = props;
  
  const { data: termsData } = useQuery({
    queryKey: [TERMS_QUERY_KEY],
    queryFn: () => getTerms(selectedAcademicCourseId),
    enabled: !!selectedAcademicCourseId,
  });

  const terms: TermEntity[] = (termsData?.data && Array.isArray(termsData.data) && termsData.data.length > 0) ? termsData.data : [
      {
        id: "1",
        academicCourseId: "1",
        title: "Term 1",
        startDate: new Date(),
        endDate: new Date(),
      },
      {
        id: "2",
        academicCourseId: "2",
        title: "Term 2",
        startDate: new Date(),
        endDate: new Date(),
      },
      {
        id: "3",
        academicCourseId: "3",
        title: "Term 3",
        startDate: new Date(),
        endDate: new Date(),
      },
    ];

  return (
    <Seletor
      className={clsx(props.className)}
      options={terms}
      selectedOption={selectedTerm}
      setSelectedOption={setSelectedTerm}
    />
  );
};