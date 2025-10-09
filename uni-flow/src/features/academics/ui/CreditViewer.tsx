"use client";

import { useQuery } from "@tanstack/react-query";

import { useAcademicStore } from "@/shared/stores";
import { SubjectRow } from "../types";
import { getAcademicCourse } from "../apis";

interface Props {
  className?: string;
  subjects: SubjectRow[];
}

export const CreditViewer = (props: Props) => {
  const { subjects } = props;
  const { academicCourseId } = useAcademicStore();

  const { data } = useQuery({
    queryKey: ["academic-courses", academicCourseId],
    queryFn: () => getAcademicCourse(academicCourseId!),
    enabled: !!academicCourseId,
  });

  const academicCourse = data?.data?.data;

  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0) || 0;

  return <div className="flex items-center justify-between text-sm">
    <p>
      <span className="font-medium">total credit point:</span> {totalCredits} / {academicCourse?.credits}
    </p>
  </div>;
};
