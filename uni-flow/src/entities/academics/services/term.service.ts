import { prisma } from "@/shared/lib/prisma";
import { CreateTermDto, UpdateTermDto } from "../dto";
import { TermEntity } from "../entities";

export const getTerms = async ({ academicCourseId }: { academicCourseId?: string }): Promise<{ data: TermEntity[]; count: number }> => {
  if (!academicCourseId) {
    const terms = await prisma.term.findMany({ where: { academicCourseId } });

    return { data: terms, count: terms.length };
  }

  const terms = await prisma.term.findMany({ where: { academicCourseId } });
  return { data: terms, count: terms.length };
};

export const getTerm = async ({ id }: { id: string}): Promise<{ data: TermEntity }> => {
  const term = await prisma.term.findUnique({ where: { id } });

  if (!term) {
    throw new Error("Term not found");
  }

  return { data: term };
};

export const createTerm = async ({ academicCourseId, createTermDto }: { 
  academicCourseId: string, 
  createTermDto: CreateTermDto 
}): Promise<{ data: TermEntity }> => {
  const newTerm: TermEntity = await prisma.term.create({ data: { ...createTermDto, academicCourseId } });
  return { data: newTerm };
};

export const updateTerm = async ({ id, dto }: { id: string, dto: UpdateTermDto }): Promise<{ data: TermEntity }> => {
  const term = await prisma.term.findUnique({ where: { id } });

  if (!term) {
    throw new Error("Term not found");
  }

  const updatedTerm = await prisma.term.update({ where: { id }, data: dto });

  return { data: updatedTerm };
};


export const deleteTerm = async ({ id }: { id: string }): Promise<{ data: string }> => {
  const deletedTerm: TermEntity = await prisma.term.delete({ where: { id } });
  return { data: deletedTerm.id };
};
