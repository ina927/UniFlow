import { prisma } from "@/shared/lib/prisma";
import { CreateSubjectDto, UpdateSubjectDto } from "../dto";
import { SubjectEntity, SubjectDetail } from "../entities";

export const getSubjects = async ({ academicCourseId, termId }: { academicCourseId: string, termId?: string }): Promise<{ data: SubjectEntity[]; count: number }> => {
  if (!termId) {
    const subjects = await prisma.subject.findMany({
      where: { term: { academicCourseId } },
    });
    return { data: subjects, count: subjects.length };
  }

  const subjects = await prisma.subject.findMany({ where: { termId } });
  return { data: subjects, count: subjects.length };
};

export const getSubject = async ({ id }: { id: string}): Promise<{ data: SubjectEntity }> => {
  const subject = await prisma.subject.findUnique({ where: { id } });

  if (!subject) {
    throw new Error("Subject not found");
  }

  return { data:  subject };
};

export const createSubject = async ({ termId, dto }: { 
  termId: string, 
  dto: CreateSubjectDto 
}): Promise<{ data: SubjectEntity }> => {
  let coordinatorId: string | undefined;
  let labTutorId: string | undefined;
  
  if (dto.coordinatorName) {
    const coordinator = await prisma.instructor.create({ data: { name: dto.coordinatorName, email: dto.coordinatorEmail } });
    coordinatorId = coordinator.id;
  }
  
  if (dto.labTutorName) {
    const labTutor = await prisma.instructor.create({ data: { name: dto.labTutorName, email: dto.labTutorEmail } });
    labTutorId = labTutor.id;
  }

  const newSubject: SubjectEntity = await prisma.subject.create({ 
    data: { 
      ...dto, 
      termId, 
      coordinatorId, 
      labTutorId 
    }
  });
  
  return { data: newSubject };
};

export const updateSubject = async ({ id, dto }: { id: string, dto: UpdateSubjectDto }): Promise<{ data: SubjectEntity }> => {
  const subject = await prisma.subject.findUnique({ where: { id } });

  if (!subject) {
    throw new Error("Subject not found");
  }

  let coordinatorId: string | undefined;
  let labTutorId: string | undefined;
  
  if (dto.coordinatorName) {
    const coordinator = await prisma.instructor.create({ data: { name: dto.coordinatorName, email: dto.coordinatorEmail } });
    coordinatorId = coordinator.id;
  }
  
  if (dto.labTutorName) {
    const labTutor = await prisma.instructor.create({ data: { name: dto.labTutorName, email: dto.labTutorEmail } });
    labTutorId = labTutor.id;
  }

  const updatedSubject = await prisma.subject.update({ 
    where: { id }, 
    data: { 
      ...dto, 
      coordinatorId, 
      labTutorId 
    } 
  });

  return { data: updatedSubject };
};


export const deleteSubject = async ({ id }: { id: string }): Promise<{ data: string }> => {
  const deletedSubject: SubjectEntity = await prisma.subject.delete({ where: { id } });
  return { data: deletedSubject.id };
};


export async function getSubjectDetailById(id: string): Promise<SubjectDetail | null> {
  const row = await prisma.subject.findUnique({
    where: { id },
    include: {
      term: true,
      coordinator: true,
      labTutor: true,
    },
  });
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    code: row.code,
    credits: row.credits,
    goalGrade: row.goalGrade ?? null,
    actualGrade: row.actualGrade ?? null,
    termTitle: row.term?.title ?? null,
    academicYear: row.term?.academicYear ?? null,
    coordinatorName: row.coordinator?.name ?? null,
    coordinatorEmail: row.coordinator?.email ?? null,
    labTutorName: row.labTutor?.name ?? null,
    labTutorEmail: row.labTutor?.email ?? null,
  };
}