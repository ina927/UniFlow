'use client';

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { getAcademicCourses } from "@/features/academics";
import { ACADEMIC_COURSES_QUERY_KEY } from "@/shared/consts";
import { AcademicHeader } from "@/widgets/academics";
import { useAcademicStore } from "@/shared/stores/academicStore";

export default function Academic() {
  const { academicCourse, setAcademicCourse } = useAcademicStore();
  
  const { 
    data: academicCoursesData, 
    isPending: academicCoursesIsPending, 
    isError: academicCoursesIsError, 
    error: academicCoursesError 
  } = useQuery({
    queryKey: [ACADEMIC_COURSES_QUERY_KEY],
    queryFn: () => getAcademicCourses(),
    enabled: true,
  });

  // Move useEffect to the top level of the component
  useEffect(() => {
    if (academicCoursesData?.data?.data?.[0]) {
      setAcademicCourse(academicCoursesData.data.data[0]);
    }
  }, [academicCoursesData, setAcademicCourse]);

  if (academicCoursesIsPending) {
    return <div className="flex justify-center items-center h-screen">Loading courses...</div>;
  }

  if (academicCoursesIsError) {
    return <div className="flex justify-center items-center h-screen">Error loading courses: {academicCoursesError?.message}</div>;
  }

  return (
    <section className="p-4 max-w-[calc(100vw-94px)]">
      <AcademicHeader academicCourse={academicCourse!} />

      <div className="flex flex-row items-center mb-4">
        <h3 className="font-bold">Terms: </h3>
        {/* <TermSeletor
          className="ml-2 w-48 cursor-pointer"
        /> */}
        <Image
          src="/settings.svg"
          alt="Setting"
          width={20}
          height={20}
          className="ml-2 cursor-pointer"
          onClick={() => {}}
        />
      </div>
    </section>
  );
}
