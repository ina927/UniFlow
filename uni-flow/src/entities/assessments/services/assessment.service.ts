import { prisma } from "@/shared/lib/prisma";
import type { Assessment } from "..";
import { AssessmentType, CreateAssessmentDto, EnterScoreDto } from "..";

// Helper: convert DB row → front-end Assessment entity
function toEntity(a: any): Assessment {
  return {
    id: a.id,
    subjectId: a.subjectId,
    title: a.title,
    description: a.description ?? undefined,
    weight: a.weight,
    maxScore: a.maxScore,
    score: a.score ?? null,
    dueDate: a.dueDate ? a.dueDate.toISOString() : undefined,
    type: (AssessmentType as any)[a.type] ?? AssessmentType.OTHER,
  };
}

// GET: list all assessments for a subject
export async function listAssessments(params: { subjectId: string }) {
  const rows = await prisma.assessment.findMany({
    where: { subjectId: params.subjectId },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toEntity);
}

// POST: create a new assessment
export async function createAssessment(params: { dto: CreateAssessmentDto }) {
  const d = params.dto;
  const created = await prisma.assessment.create({
    data: {
      subjectId: d.subjectId,
      title: d.title,
      type: String(d.type), // enum -> string
      weight: d.weight,
      maxScore: d.maxScore,
      dueDate: d.dueDate ? new Date(d.dueDate) : new Date(),
      description: d.description ?? null,
    },
  });
  return toEntity(created);
}

// PATCH: enter/update score
export async function enterScore(params: { dto: EnterScoreDto }) {
  const d = params.dto;
  const updated = await prisma.assessment.update({
    where: { id: d.assessmentId },
    data: {
      score: d.score,
      // no gradedDate in DB, only return to frontend if needed
    },
  });
  return toEntity(updated);
}
