import { prisma } from "@/shared/lib/prisma";
import { CreateInstructorDto, UpdateInstructorDto } from "../dto";
import { InstructorEntity } from "../entities";

export const getInstructors = async ({ subjectId }: { subjectId: string }): Promise<{ data: InstructorEntity[]; count: number }> => {
  const instructors: InstructorEntity[] = await prisma.instructor.findMany({
    where: {
      subjects: {
        some: {
          id: subjectId,
        },
      },
      labSubjects: {
        some: {
          id: subjectId,
        },
      },
    },
    include: {
      subjects: true,
      labSubjects: true,
    }
  });

  return { data: instructors, count: instructors.length };
};  

export const getInstructor = async ({ id }: { id: string}): Promise<{ data: InstructorEntity }> => {
  const instructor = await prisma.instructor.findUnique({ where: { id } });

  if (!instructor) {
    throw new Error("Instructor not found");
  }

  return { data:  instructor };
};

export const createInstructor = async ({ dto }: { 
  dto: CreateInstructorDto 
}): Promise<{ data: InstructorEntity }> => {
  const newInstructor: InstructorEntity = await prisma.instructor.create({ data: { ...dto } });
  return { data: newInstructor };
};

export const updateInstructor = async ({ id, dto }: { id: string, dto: UpdateInstructorDto }): Promise<{ data: InstructorEntity }> => {
  const instructor = await prisma.instructor.findUnique({ where: { id } });

  if (!instructor) {
    throw new Error("Instructor not found");
  }

  const updatedInstructor = await prisma.instructor.update({ where: { id }, data: dto });

  return { data: updatedInstructor };
};

export const deleteInstructor = async ({ id }: { id: string }): Promise<{ data: string }> => {
  const deletedInstructor: InstructorEntity = await prisma.instructor.delete({ where: { id } });
  return { data: deletedInstructor.id };
};
