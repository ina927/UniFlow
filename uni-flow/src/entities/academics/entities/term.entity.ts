export interface TermEntity {
  id: string;
  academicCourseId: string;
  title: string;
  currentAcademicYear?: number;
  startDate?: Date;
  endDate?: Date;
}
