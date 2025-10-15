import type { Assessment } from "../entities/assessment.entity";
import type { CreateAssessmentDto, EnterScoreDto, UpdateAssessmentDto } from "../dto";
import { prisma } from '@/shared/lib/prisma';
import { AssessmentType } from "../enums";
import { notFoundError } from "@/shared/consts/error-types";

interface AssessmentModel extends Omit<Assessment, 'type' | 'dueDate' | 'description'> {
  type: string | undefined;
  dueDate: Date | string | null;
  description: string | null;
}

export const toAssessmentType = (type: string | AssessmentType): AssessmentType => {
  if (typeof type === 'string') {
    switch (type) {
      case 'Quiz':
        return AssessmentType.QUIZ;
      case 'Exam':
        return AssessmentType.EXAM;
      case 'Group Assignment':
        return AssessmentType.GROUP_ASSIGNMENT;
      case 'Individual Assignment':
        return AssessmentType.INDV_ASSIGNMENT;
      case 'Group, Individual Assignment':
        return AssessmentType.GROUP_INDV_ASSIGNMENT;
      case 'Other':
        return AssessmentType.OTHER;
      default: 
        return AssessmentType.OTHER;
    }
  }
  
  return type;
};

// Helper: convert DB row → front-end Assessment entity
function toEntity(a: AssessmentModel): Assessment {
  return {
    id: a.id,
    subjectId: a.subjectId,
    title: a.title,
    type: toAssessmentType(a.type ?? ""),
    description: a.description ?? undefined,
    weight: a.weight,
    maxScore: a.maxScore,
    score: a.score ?? null,
    dueDate: a.dueDate ? (typeof a.dueDate === 'string' ? a.dueDate : a.dueDate.toISOString()) : undefined,
  };
}

// GET: list all assessments for a subject
export async function listAssessments(params: { subjectId: string }): Promise<Assessment[]> {
  const assessments = await prisma.assessment.findMany({
    where: { subjectId: params.subjectId },
    orderBy: { dueDate: 'asc' },
  });

  return assessments.map(toEntity);
}

// GET: get an assessment by ID
export async function getAssessment(id: string) {
  const assessment = await prisma.assessment.findUnique({ where: { id } });
  if (!assessment) {
    throw notFoundError("Assessment");
  }
  return toEntity(assessment);
}

// POST: create a new assessment
export async function createAssessment(params: { dto: CreateAssessmentDto }): Promise<Assessment> {
  const d = params.dto;
  const created = await prisma.assessment.create({
    data: {
      subjectId: d.subjectId,
      title: d.title,
      type: d.type ?? undefined,
      weight: d.weight,
      maxScore: d.maxScore,
      dueDate: d.dueDate ? new Date(d.dueDate) : new Date(),
      description: d.description ?? undefined,
    },
  });
  return toEntity(created);
}

// PATCH: enter/update score
export async function enterScore(params: { dto: EnterScoreDto }) {
  const updated = await prisma.assessment.update({
    where: { id: params.dto.assessmentId },
    data: {
      score: params.dto.score,
    },
  });
  return toEntity(updated);
}

// PATCH: Update assessment
export async function updateAssessment(params: { id: string; dto: UpdateAssessmentDto }) {
  const d = params.dto;
  const updated = await prisma.assessment.update({
    where: { id: params.id },
    data: {
      title: d.title ?? undefined,
      type: d.type ?? undefined,
      weight: d.weight ?? undefined,
      maxScore: d.maxScore ?? undefined,
      dueDate: d.dueDate ? new Date(d.dueDate) : undefined,
      description: d.description ?? undefined,
    },
  });
  return toEntity(updated);
}

// DELETE: Delete assessment
export async function deleteAssessment(id: string) {
  const deleted = await prisma.assessment.delete({ where: { id } });
  return toEntity(deleted);
}
