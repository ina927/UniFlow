export interface TermEntity {
  id: string;
  academicCourseId: string;
  title: string;
  academicYear?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}
