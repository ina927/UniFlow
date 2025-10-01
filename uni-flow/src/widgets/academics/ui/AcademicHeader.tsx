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
      <h2 className="text-title1-bold">{academicCourse?.degree || "Academic Course"}</h2>
      <p className="text-body2-bold">{academicCourse?.credits || 0} credit points</p>
    </header>
  );
};
