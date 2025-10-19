import type { Assessment } from "../entities/assessment.entity";
import type { CreateAssessmentDto, EnterScoreDto, UpdateAssessmentDto } from "../dto";
import { prisma } from '@/shared/lib/prisma';
import { AssessmentType } from "../enums";
import { notFoundError } from "@/shared/consts/error-types";
import type { $Enums } from "@/shared/generated/prisma";

interface AssessmentModel extends Omit<Assessment, 'type' | 'dueDate' | 'description'> {
  type: string | undefined;
  dueDate: Date | string | null;
  description: string | null;
}

// const API_BASE_URL = '/api/assessments';

export const toAssessmentType = (
  type: string | AssessmentType | $Enums.AssessmentType | undefined
): AssessmentType => {
  if (type == null) return AssessmentType.OTHER;

  if (typeof type !== 'string') {
    return type as AssessmentType;
  }

  const U = type.trim().toUpperCase().replace(/[,\s]+/g, "_");
  switch (U) {
    case "QUIZ": return AssessmentType.QUIZ;
    case "EXAM": return AssessmentType.EXAM;
    case "GROUP_ASSIGNMENT": return AssessmentType.GROUP_ASSIGNMENT;
    case "INDV_ASSIGNMENT": return AssessmentType.INDV_ASSIGNMENT;
    case "GROUP_INDV_ASSIGNMENT": return AssessmentType.GROUP_INDV_ASSIGNMENT;
  }

  switch (type) {
    case "Quiz": return AssessmentType.QUIZ;
    case "Exam": return AssessmentType.EXAM;
    case "Group Assignment": return AssessmentType.GROUP_ASSIGNMENT;
    case "Individual Assignment": return AssessmentType.INDV_ASSIGNMENT;
    case "Group, Individual Assignment": return AssessmentType.GROUP_INDV_ASSIGNMENT;
    case "Other": return AssessmentType.OTHER;
    default: return AssessmentType.OTHER;
  }
};

const fromEnumToDbLabel = (v: AssessmentType): string => {
  switch (v) {
    case AssessmentType.QUIZ: return "Quiz";
    case AssessmentType.EXAM: return "Exam";
    case AssessmentType.GROUP_ASSIGNMENT: return "Group Assignment";
    case AssessmentType.INDV_ASSIGNMENT: return "Individual Assignment";
    case AssessmentType.GROUP_INDV_ASSIGNMENT: return "Group, Individual Assignment";
    default: return "Other";
  }
};

export const toDbAssessmentType = (t: string | AssessmentType | undefined): string | undefined => {
  if (t == null) return undefined;
  const asEnum = typeof t === "string" ? toAssessmentType(t) : t;
  return fromEnumToDbLabel(asEnum);
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
  // try {
  //   const response = await fetch(`${API_BASE_URL}/${id}`);
  //   if (!response.ok) {
  //     throw new Error('Failed to fetch assessment');
  //   }
  //   const data = await response.json();
  //   return toEntity(data);
  // } catch (error) {
  //   console.error('Error fetching assessment:', error);
  //   throw error;
  // }

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
      type: toDbAssessmentType(d.type) ?? 'OTHER',
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
  // try {
  //   const { assessmentId, score } = params.dto;
  //   const response = await fetch(`${API_BASE_URL}/${assessmentId}/score`, {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ score }),
  //   });

  //   if (!response.ok) {
  //     throw new Error('Failed to update score');
  //   }

  //   const data = await response.json();
  //   return toEntity(data);
  // } catch (error) {
  //   console.error('Error updating score:', error);
  //   throw error;
  // }

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
      type: toDbAssessmentType(d.type),
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
  // try {
  //   const response = await fetch(`${API_BASE_URL}/${id}`, {
  //     method: 'DELETE',
  //   });

  //   if (!response.ok) {
  //     throw new Error('Failed to delete assessment');
  //   }
  // } catch (error) {
  //   console.error('Error deleting assessment:', error);
  //   throw error;
  // }

  const deleted = await prisma.assessment.delete({ where: { id } });
  return toEntity(deleted);
}
