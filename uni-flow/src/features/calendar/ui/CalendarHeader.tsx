import Link from 'next/link';

import { Combobox } from '@/widgets/planner/SetFilterModal';
import styles from '@/features/calendar/ui/CalendarHeader.module.css'
import { useUserId } from '@/shared/stores';
import { useState } from 'react';

// type setup
type CalendarHeaderProps = {
  academicCourseId: string;
  onSubjectFilterChange: (subjectId: string | null) => void;
};

// PLANNER HEADER ONLY
export const CalendarHeader = ({
  academicCourseId,
  onSubjectFilterChange,
}: CalendarHeaderProps) => {
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
        {name}&#39;s Study Calendar
      </h1>
      <div className={styles.filter}>
      <Combobox
        academicCourseId={academicCourseId}
        onSubjectChange={handleSubjectFilterChange}
      />
      <Link
        href='../planner'
        style={{
          float: 'right',
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
        📋
      </Link>
      </div>
    </div>
  );
};
function UseState<T>(arg0: null): { user: any; setUser: any; } {
  throw new Error('Function not implemented.');
}

