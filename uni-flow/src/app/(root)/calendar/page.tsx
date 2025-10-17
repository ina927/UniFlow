'use client';

import { useState } from 'react';

import { CalendarComp } from '@/features/calendar/ui/CalendarComp';
import { CalendarHeader } from '@/features/calendar/ui/CalendarHeader';
import { isLogin } from '@/shared/lib/isLogin';
import { useAcademicStore } from '@/shared/stores';
import styles from './page.module.css';

export default function PlannerPage() {
  isLogin();
  const { academicCourseId } = useAcademicStore();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null
  );

  const handleSubjectFilterChange = (subjectId: string | null) => {
    console.log('Testing: ' + subjectId);
    setSelectedSubjectId(subjectId);
  };

  return (
    <div className={styles.calendar}>
      <CalendarHeader
        academicCourseId={academicCourseId!}
        onSubjectFilterChange={handleSubjectFilterChange}
      />
      <CalendarComp
        academicCourseId={academicCourseId!}
        filterBySubjectId={selectedSubjectId}
      />
    </div>
  );
}
