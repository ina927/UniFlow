export interface SubjectEntity {
  id: string;
  termId: string;
  title: string;
  code: string;
  credits: number;
  coordinatorId?: string | null;
  labTutorId?: string | null;
  goalGrade?: number | null;
  actualGrade?: number | null;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface SubjectDetail {
  id: string;
  title: string;
  code: string;
  credits: number;
  goalGrade: number | null;
  actualGrade: number | null;
  termTitle: string | null;
  academicYear: number | null;
  coordinatorName: string | null;
  coordinatorEmail: string | null;
  labTutorName: string | null;
  labTutorEmail: string | null;
}
