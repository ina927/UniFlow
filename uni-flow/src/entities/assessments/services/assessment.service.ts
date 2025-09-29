import { prisma } from "@/shared/lib/prisma";
import type { Assessment } from "..";
import { AssessmentType, CreateAssessmentDto, EnterScoreDto, UpdateAssessmentDto } from "..";

const TYPE_VALUES = Object.values(AssessmentType) as string[];

function normalizeTypeFromDb(raw: unknown): AssessmentType {
  if (typeof raw === "string") {
    if (TYPE_VALUES.includes(raw)) return raw as AssessmentType;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const byKey = (AssessmentType as any)[raw];
    if (typeof byKey === "string" && TYPE_VALUES.includes(byKey)) {
      return byKey as AssessmentType;
    }
  }
  return AssessmentType.OTHER;
}

// Helper: convert DB row → front-end Assessment entity
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    type: normalizeTypeFromDb(a.type),
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

// GET: get an assessment by ID
export async function getAssessment(id: string) {
  const row = await prisma.assessment.findUnique({ where: { id } });
  if (!row) return null;
  return toEntity(row);
}

// POST: create a new assessment
export async function createAssessment(params: { dto: CreateAssessmentDto }) {
  const d = params.dto;
  const created = await prisma.assessment.create({
    data: {
      subjectId: d.subjectId,
      title: d.title,
      type: d.type ?? undefined,
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

