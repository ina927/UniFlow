"use client";

import { useQuery } from "@tanstack/react-query";
import { Link } from "lucide-react";

import { getAcademicCourses } from "@/features";
import { Button } from "@/shared/ui/button";
import { AcademicHeader, SubjectTable, TermSelector } from "@/widgets/academics";
import { useAcademicStore } from "@/shared/stores/academicStore";
import { AcademicCourse } from "@/shared/generated/prisma";

export default function AcademicPage() { 
  const { academicCourseId, setAcademicCourseId } = useAcademicStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["academic-courses"],
    queryFn: () => getAcademicCourses(),
    enabled: !academicCourseId,
  });

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error!</div>

  if (!academicCourseId && data?.data?.data) {
    setAcademicCourseId(data?.data?.data[4].id);
  }

  const academicCourse = data?.data?.data.find((course: AcademicCourse) => course.id === academicCourseId);

  if (!academicCourse) return (
    <section className="flex flex-col items-center justify-center h-full">
      <h3 className="text-title2-bold">Academic course not found</h3>
      <Link href="/academic/create">
        <Button variant="ghost" size="icon">
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
