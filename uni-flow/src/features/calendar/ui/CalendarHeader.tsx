import Link from 'next/link';

import { Combobox } from '@/widgets/planner/SetFilterModal';

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

  return (
    <div
      className='title'
      style={{ display: 'flex', flexDirection: 'row' }}
    >
      <h1
        className='text-large-title-bold'
        style={{ width: '40vw' }}
      >
        User&#39;s Study Calendar
      </h1>
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
  );
};
