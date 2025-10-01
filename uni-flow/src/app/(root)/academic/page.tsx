"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { AcademicCourseEntity } from "@/entities/academics/entities";
import { getAcademicCourses } from "@/features/academics";
import { useAcademicStore } from "@/shared/stores/academicStore";
import { AcademicHeader, SubjectTable, TermSelector } from "@/widgets/academics";
import { Button } from "@/shared/ui/button";

export default function AcademicPage() { 
  const { academicCourseId, setAcademicCourseId } = useAcademicStore();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["academic-courses"],
    queryFn: () => getAcademicCourses(),
    staleTime: 5 * 60 * 1000,
  });

  const academicCourses = useMemo(() => data?.data?.data || [], [data]);
  const hasCourses = academicCourses.length > 0;

  useEffect(() => {
    if (hasCourses && !academicCourseId) {
      setAcademicCourseId(academicCourses[0].id);
    }
  }, [hasCourses, academicCourseId, academicCourses, setAcademicCourseId]);

  if (isLoading || (hasCourses && !academicCourseId)) {
    return <div>Loading...</div>;
  }
  
  if (isError) {
    return <div>Error loading academic courses</div>;
  }

  const academicCourse = academicCourses.find((course: AcademicCourseEntity) => course.id === academicCourseId);

  if (!academicCourse) return (
    <section className="flex flex-col items-center justify-center h-full">
      <h3 className="text-title2-bold">Academic course not found</h3>
      <Link href="/academic/create">
        <Button variant="ghost" size="lg">
          Add Academic Course
        </Button>
      </Link>
    </section>
  );

  return (
    <section className="p-4 max-w-[calc(100vw-94px)]">
      <AcademicHeader academicCourse={academicCourse} />
      <TermSelector />
      <SubjectTable />
    </section>
  );
}
