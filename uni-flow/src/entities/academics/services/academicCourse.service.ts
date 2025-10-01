import { prisma } from "@/shared/lib/prisma";
import { CreateAcademicCourseDto, UpdateAcademicCourseDto } from "../dto";
import { AcademicCourseEntity } from "../entities";
import { deleteFailed, notFoundError, updateFailed } from "@/shared";

export const getAcademicCourses = async ({ userId }: { userId: string }): Promise<{ data: AcademicCourseEntity[]; count: number }> => {
  const academicCourses = await prisma.academicCourse.findMany({ where: { userId } });

  if (academicCourses.length === 0) {
    throw notFoundError("Academic Courses");
  }

  return { data: academicCourses, count: academicCourses.length };
};

export const getAcademicCourse = async ({ id }: { id: string}): Promise<{ data: AcademicCourseEntity }> => {
  const academicCourse = await prisma.academicCourse.findUnique({ where: { id } });

  if (!academicCourse) {
    throw new Error("Academic course not found", { cause: 404 });
  }

  return { data: academicCourse };
};

export const createAcademicCourse = async ({ userId, dto }: { 
  userId: string, 
  dto: CreateAcademicCourseDto 
}): Promise<{ data: AcademicCourseEntity }> => {
  const newAcademicCourse: AcademicCourseEntity = await prisma.academicCourse.create({ data: { ...dto, userId } });
  return { data: newAcademicCourse };
};

export const updateAcademicCourse = async ({ id, dto }: { id: string, dto: UpdateAcademicCourseDto }): Promise<{ data: AcademicCourseEntity }> => {
  const academicCourse = await prisma.academicCourse.findUnique({ where: { id } });

  if (!academicCourse) {
    throw new Error("Academic course not found", { cause: 404 });
  }

  const updatedAcademicCourse = await prisma.academicCourse.update({ where: { id }, data: dto });

  if (!updatedAcademicCourse) {
    throw updateFailed("Academic Course");
  }

  return { data: updatedAcademicCourse };
};


export const deleteAcademicCourse = async ({ id }: { id: string }): Promise<{ data: string }> => {
  const deletedAcademicCourse: AcademicCourseEntity = await prisma.academicCourse.delete({ where: { id } });

  if (!deletedAcademicCourse) {
    throw deleteFailed("Academic Course");
  }

  return { data: deletedAcademicCourse.id };
};
