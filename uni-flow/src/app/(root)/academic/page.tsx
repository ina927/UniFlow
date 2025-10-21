'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { AcademicCourseEntity } from '@/entities/academics/entities';
import { getAcademicCourses } from '@/features/academics';
import { isLogin } from '@/shared/lib/isLogin';
import { useAcademicStore } from '@/shared/stores/academicStore';
import {
  AcademicHeader,
  SubjectTable,
  TermSelector,
} from '@/widgets/academics';

export default function AcademicPage() {
  isLogin();

  const { academicCourseId, setAcademicCourseId } = useAcademicStore();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['academic-courses'],
    queryFn: () => getAcademicCourses(),
    staleTime: 5 * 60 * 1000,
  });

  const academicCourses = useMemo(() => data?.data?.data || [], [data]);

  console.log('academicCourses', academicCourses);
  const hasCourses = academicCourses.length > 0;

  if (isLoading || (!hasCourses && !academicCourseId)) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading academic courses</div>;
  }

  if (hasCourses && !academicCourseId) {
    setAcademicCourseId(academicCourses[0].id);

    console.log('academicCourseId', academicCourseId);
  }

  const academicCourse = academicCourses.find(
    (course: AcademicCourseEntity) => course.id === academicCourseId
  );

  if (!academicCourse)
    return (
      <section className='flex flex-col items-center justify-center h-full'>
        <h3 className='text-title2-bold'>Academic course not found</h3>
      </section>
    );

  return (
    <section className={'flex flex-col w-[90%] my-[44px] mx-auto'}>
      <AcademicHeader academicCourse={academicCourse} />
      <TermSelector />
      <SubjectTable />
    </section>
  );
}
