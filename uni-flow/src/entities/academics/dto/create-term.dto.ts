export type CreateTermDto = {
  academicCourseId: string;
  title: string;
  academicYear?: number;
  startDate?: Date;
  endDate?: Date;
};
