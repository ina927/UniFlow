import clsx from 'clsx';

import { AcademicCourseEntity } from '@/entities/academics';

interface Props {
  className?: string;
  academicCourse: AcademicCourseEntity;
}

export const AcademicHeader = (props: Props) => {
  const { academicCourse } = props;

  return (
    <header className={clsx(props.className, "flex flex-col mb-4")}>
      <h2 className="text-lg font-bold">{academicCourse?.degree || "Academic Course"}</h2>
      <p>{academicCourse?.credits || 0} credit points</p>
    </header>
  );
};
