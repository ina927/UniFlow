import { PlannerHeader } from '@/features/planner/ui/PlannerHeader';

type CalendarHeaderProps = {
  academicCourseId: string;
  onSubjectFilterChange: (subjectId: string | null) => void;
};

export const CalendarHeader = ({
  academicCourseId,
  onSubjectFilterChange,
}: CalendarHeaderProps) => {
  return (
    <PlannerHeader
      academicCourseId={academicCourseId}
      onSubjectFilterChange={onSubjectFilterChange}
      mode="calendar"
    />
  );
};