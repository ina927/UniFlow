export type CreateTermDto = {
  academicCourseId: string;
  title?: string;
  currentAcademicYear?: number;
  startDate?: Date;
  endDate?: Date;
};
