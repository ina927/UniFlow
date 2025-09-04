'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getSubjects } from "@/features/academics/api";
import { SubjectItem, TermSeletor } from "@/features/academics/ui";
import { SubjectEntity } from "@/entities";
import {  SUBJECTS_QUERY_KEY } from "@/shared/consts";
import { AcademicSeletor } from "@/features/academics/ui/AcademicSeletor";

export default function Academic() {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedTerm, setSelectedTerm] = useState<string>("");

  console.log(selectedCourse);
  console.log(selectedTerm);
  
  const { data: subjectsData } = useQuery({
    queryKey: [SUBJECTS_QUERY_KEY, selectedTerm],
    queryFn: () => getSubjects(selectedTerm),
    enabled: !!selectedTerm,
  });

  // if (isPending) {
  //   return <div>Loading courses...</div>;
  // }

  // if (isError) {
  //   return <div>Error loading courses: {error?.message}</div>;
  // }

  const subjects: SubjectEntity[] = (subjectsData?.data && Array.isArray(subjectsData.data) && subjectsData.data.length > 0) ? subjectsData.data : [
    {
      id: "1",
      termId: "1",
      title: "Subject 1",
      code: "SUBJ1",
      credits: 6,
    },
    {
      id: "2",
      termId: "1",
      title: "Subject 2",
      code: "SUBJ2",
      credits: 6,
    },
  ];

  return (
    <div className="p-4 max-w-[calc(100vw-94px)]">
      <h2 className="text-lg font-bold mb-4">
        <AcademicSeletor
          className="mr-4"
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
        />

        <TermSeletor
          selectedAcademicCourseId={selectedCourse}
          selectedTerm={selectedTerm}
          setSelectedTerm={setSelectedTerm}
        />
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-4 mt-6">
        {subjects.length > 0 ? (
          subjects.map((subject: SubjectEntity) => (
            <SubjectItem key={subject.id} subject={subject} />
          ))
        ) : (
          <p>No subjects found for the selected term.</p>
        )}
      </div>
    </div>
  );
}
