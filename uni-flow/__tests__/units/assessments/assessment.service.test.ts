import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createAssessment,
  enterScore,
  deleteAssessment,
} from "@/entities/assessments/services/assessment.service";
import { AssessmentType } from "@/entities/assessments/enums/AssessmentType";

// In-memory store simulating Prisma
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const store = new Map<string, any>();
let idSeq = 1;

// Mock prisma client
vi.mock("@/shared/lib/prisma", () => ({
  prisma: {
    assessment: {
      create: vi.fn(async ({ data }) => {
        const now = new Date();
        const row = { id: `id-${idSeq++}`, createdAt: now, updatedAt: now, ...data };
        store.set(row.id, row);
        return row;
      }),
      findUnique: vi.fn(async ({ where }) => store.get(where.id) ?? null),
      update: vi.fn(async ({ where, data }) => {
        const current = store.get(where.id);
        const updated = { ...current, ...data, updatedAt: new Date() };
        store.set(where.id, updated);
        return updated;
      }),
      delete: vi.fn(async ({ where }) => {
        const deleted = store.get(where.id);
        store.delete(where.id);
        return deleted;
      }),
      findMany: vi.fn(async ({ where }) => {
        return Array.from(store.values()).filter(r => r.subjectId === where.subjectId);
      }),
    },
  },
}));

beforeEach(() => {
  store.clear();
  idSeq = 1;
});

describe("assessment.service basic behavior", () => {
  it("createAssessment assigns default dueDate if not provided", async () => {
    const dto = {
      subjectId: "S1",
      title: "Quiz 1",
      type: AssessmentType.QUIZ,
      weight: 20,
      maxScore: 20,
    };
    const created = await createAssessment({ dto });
    expect(created.dueDate).toBeDefined();
  });

  it("enterScore only updates the score field", async () => {
    const dto = {
      subjectId: "S1",
      title: "Exam",
      type: AssessmentType.EXAM,
      weight: 50,
      maxScore: 100,
      dueDate: new Date().toISOString(),
    };
    const created = await createAssessment({ dto });
    const updated = await enterScore({ dto: { assessmentId: created.id, score: 77 } });
    expect(updated.score).toBe(77);
    expect(updated.title).toBe("Exam");
  });

  it("deleteAssessment removes the record", async () => {
    const dto = {
      subjectId: "S1",
      title: "Delete Me",
      type: AssessmentType.OTHER,
      weight: 10,
      maxScore: 10,
      dueDate: new Date().toISOString(),
    };
    const created = await createAssessment({ dto });
    const deleted = await deleteAssessment(created.id);
    expect(deleted.id).toBe(created.id);
  });
});
