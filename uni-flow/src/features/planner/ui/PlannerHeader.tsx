import Link from 'next/link';

import { Combobox } from '@/widgets/planner/SetFilterModal';
import styles from '@/features/planner/ui/PlannerHeader.module.css'
import { useUserId } from '@/shared/stores';
import { useState } from 'react';

// type setup
type PlannerHeaderProps = {
  academicCourseId: string;
  onSubjectFilterChange: (subjectId: string | null) => void;
};

// PLANNER HEADER ONLY
export const PlannerHeader = ({
  academicCourseId,
  onSubjectFilterChange,
}: PlannerHeaderProps) => {
  const handleSubjectFilterChange = (subjectId: string) => {
    onSubjectFilterChange(subjectId || null);
  };

  const [name, setName] = useState<string>("");

  const getUserDetails = async() => {
      try {
        const res = await fetch('/api/user/me', { cache: 'no-store' });
        if (res.status === 401) {
          return;
        }
        const data = await res.json();
        if (data.user) {
          setName(data.user.name || '');
        }
      } catch {

      } finally {

      }
    }

    const userId = useUserId();
    if (userId){
      getUserDetails();
    }

  return (
    <div
      className={styles.header}
    >
      <h1
        className='text-large-title-bold'
        style={{ width: '40vw' }}
      >
        {name}&#39;s Study Planner
      </h1>
      <div className={styles.filter} style={{display: "flex", flexDirection: "row"}}>
      <Combobox
        academicCourseId={academicCourseId}
        onSubjectChange={handleSubjectFilterChange}
      />
      <Link
        href='../calendar'
        style={{
          // float: 'right',
          marginLeft: '0.5vw',
          background: 'var(--background-prime)',
          color: 'var(--background)',
          paddingLeft: '0.5vw',
          paddingRight: '0.5vw',
          paddingTop: '1vh',
          height: '5vh',
          width: '2.5vw',
          borderRadius: '1vw',
          textAlign: 'left',
        }}
        className='text-title3-bold'
      >
        📆
      </Link>
      </div>
    </div>
  );
};
