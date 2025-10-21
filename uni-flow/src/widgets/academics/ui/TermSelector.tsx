'use client';

import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useState, useMemo } from 'react';
import { sortTerm } from '@/widgets/academics/lib/sortTerm';

import { getTerms } from '@/features/academics';
import { useAcademicStore } from '@/shared/stores';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { ManageTermModal } from './ManageTermModal';

interface TermSelectorProps {
  className?: string;
}

export const TermSelector = (props: TermSelectorProps) => {
  const {
    academicCourseId,
    terms,
    setTerms,
    selectedTermId,
    setSelectedTermId,
  } = useAcademicStore();
  const [placeholderText, setPlaceholderText] = useState('Select Term');

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ['terms', academicCourseId],
    queryFn: () => getTerms(academicCourseId!),
    enabled: !!academicCourseId,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (academicCourseId) {
      refetch();
    }
  }, [academicCourseId, refetch]);

  // Update terms in store when data changes
  useEffect(() => {
    if (data?.data?.data) {
      setTerms(data.data.data);
      setSelectedTermId('all');
    }
  }, [data?.data?.data, setTerms, setSelectedTermId])

  useEffect(() => {
    if (isLoading) {
      setPlaceholderText('Loading...');
    } else if (isError) {
      setPlaceholderText('Failed to load terms');
      setSelectedTermId(null);
    } else if (!terms || terms.length === 0) {
      setPlaceholderText('No Terms Found');
      setSelectedTermId(null);
    } else {
      setPlaceholderText('Select Term');
    }
  }, [terms, isError, isLoading, setSelectedTermId]);

  const sortedTerms = useMemo(
    () => (terms ? [...terms].sort(sortTerm) : []),
    [terms]
  );

  return (
    <div className={clsx(props.className, 'flex items-center gap-2 mt-4')}>
      <label className='text-title3-bold pl-2 mr-9'>Term</label>
      <Select
        onValueChange={setSelectedTermId}
        value={selectedTermId ?? 'all'}
        disabled={isLoading || isError || !terms || terms.length === 0}
      >
        <SelectTrigger className='w-[220px] h-10'>
          <SelectValue className='text-body-bold' placeholder={placeholderText} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            key={'all'}
            value={'all'}
          >
            {'All Terms'}
          </SelectItem>
          {sortedTerms.map((term) => (
            <SelectItem
              key={term.id}
              value={term.id}
            >
              {term.title} {term.academicYear}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ManageTermModal refetch={refetch} />
    </div>
  );
};
