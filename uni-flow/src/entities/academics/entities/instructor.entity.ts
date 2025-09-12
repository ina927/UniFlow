export interface InstructorEntity {
  id: string;
  name: string;
  email?: string | null;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}
