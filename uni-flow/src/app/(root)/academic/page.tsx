"use client";

import { useQuery } from "@tanstack/react-query";
import { Link } from "lucide-react";

import { getAcademicCourses } from "@/features";
import { Button } from "@/shared/ui/button";
import { AcademicHeader, SubjectTable, TermSelector } from "@/widgets/academics";

export default function AcademicPage() { 
  const { data, isLoading, isError } = useQuery({
    queryKey: ["academic-courses"],
    queryFn: () => getAcademicCourses(),
  });

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error!</div>

  const academicCourse = data?.data?.data[4];

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
      <TermSelector academicCourseId={academicCourse?.id} />
      <SubjectTable />
    </section>
  );
}
