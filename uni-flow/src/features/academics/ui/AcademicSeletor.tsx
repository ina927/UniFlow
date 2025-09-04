"use client";

import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';

import { Seletor } from '@/features/common';
import { ACADEMIC_COURSES_QUERY_KEY } from '@/shared/consts';
import { getAcademicCourses } from '../api';
import { AcademicCourseEntity } from '@/entities';

interface Props {
  className?: string;
  selectedCourse: string;
  setSelectedCourse: (courseId: string) => void;
}

export const AcademicSeletor = (props: Props) => { 
  const { selectedCourse, setSelectedCourse } = props;

  const { data: academicCoursesData } = useQuery({
    queryKey: [ACADEMIC_COURSES_QUERY_KEY],
    queryFn: () => getAcademicCourses(),
    enabled: !!selectedCourse,
  });

  const academicCourses: AcademicCourseEntity[] = (academicCoursesData?.data && Array.isArray(academicCoursesData.data) && academicCoursesData.data.length > 0) ? academicCoursesData.data : [
      {
        id: 1,
        title: "Academic Course 1",
        degree: "Bachelor of IT",
        major: "Enterprise Software Development",
        totalAcademicYear: 4,
      },
      {
        id: 2,
        title: "Academic Course 2",
        degree: "Bachelor of Science",
        major: "Computer Science",
        totalAcademicYear: 4,
      },
      {
        id: 3,
        title: "Academic Course 3",
        degree: "Bachelor of Business",
        major: "Business Information Technology",
        totalAcademicYear: 3,
      },
    ];

  return (
    <Seletor
      className={clsx(props.className)}
      options={academicCourses}
      selectedOption={selectedCourse}
      setSelectedOption={setSelectedCourse}
    />
  );
};