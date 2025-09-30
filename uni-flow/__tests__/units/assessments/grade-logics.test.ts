import { describe, it, expect } from "vitest";
import {
  isGraded,
  weightedContribution,
  overallPercent,
  completedWeightedPercent,
  letterFromPercent,
  neededToReach,
  remainingWeightSum,
  requiredMarksPerRemaining,
} from "@/features/assessments/grade-logics";
import { Grade } from "@/entities/assessments/enums/Grade";

// Simple helper to create assessment objects with defaults
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeAssessment(partial: Partial<any> = {}): any {
  return {
    id: partial.id ?? "a1",
    subjectId: partial.subjectId ?? "S1",
    title: partial.title ?? "T1",
    type: partial.type ?? "Quiz",
    weight: partial.weight ?? 0,
    maxScore: partial.maxScore ?? 0,
    score: partial.score ?? null,
    dueDate: partial.dueDate,
    description: partial.description,
  };
}

describe("grade-logics basic functions", () => {
  it("isGraded returns true only when score exists and maxScore > 0", () => {
    expect(isGraded(makeAssessment({ score: 10, maxScore: 20 }))).toBe(true);
    expect(isGraded(makeAssessment({ score: null, maxScore: 20 }))).toBe(false);
  });

  it("weightedContribution calculates (score/maxScore)*weight", () => {
    expect(
      weightedContribution(makeAssessment({ score: 18, maxScore: 20, weight: 20 }))
    ).toBeCloseTo(18);
  });
});

describe("grade-logics percentage and letter grade", () => {
  it("overallPercent sums all weighted contributions including ungraded as 0", () => {
    const items = [
      makeAssessment({ score: 80, maxScore: 100, weight: 20 }),
      makeAssessment({ score: null, maxScore: 100, weight: 30 }),
      makeAssessment({ score: 25, maxScore: 50, weight: 30 }),
    ];
    expect(overallPercent(items)).toBeCloseTo(31);
  });

  it("completedWeightedPercent considers only graded assessments", () => {
    const items = [
      makeAssessment({ score: 80, maxScore: 100, weight: 20 }),
      makeAssessment({ score: null, maxScore: 100, weight: 30 }),
      makeAssessment({ score: 25, maxScore: 50, weight: 30 }),
    ];
    expect(completedWeightedPercent(items)).toBeCloseTo(62);
  });

  it("letterFromPercent returns correct grade around thresholds", () => {
    expect(letterFromPercent(85)).toBe(Grade.HD);
    expect(letterFromPercent(84.9)).toBe(Grade.D);
    expect(letterFromPercent(75)).toBe(Grade.D);
    expect(letterFromPercent(65)).toBe(Grade.C);
    expect(letterFromPercent(50)).toBe(Grade.P);
    expect(letterFromPercent(49.9)).toBe(Grade.F);
  });
});

describe("grade-logics requirements for goals", () => {
  it("neededToReach returns 0 if target already achieved", () => {
    const items = [makeAssessment({ score: 90, maxScore: 100, weight: 100 })];
    expect(neededToReach(items, Grade.D)).toBe(0);
  });

  it("remainingWeightSum adds only ungraded weights", () => {
    const items = [
      makeAssessment({ score: 10, maxScore: 10, weight: 10 }),
      makeAssessment({ score: null, maxScore: 10, weight: 20 }),
    ];
    expect(remainingWeightSum(items)).toBe(20);
  });

  it("requiredMarksPerRemaining returns impossible if needed% > 100", () => {
    const items = [
      makeAssessment({ id: "a", score: 18, maxScore: 20, weight: 20 }),
      makeAssessment({ id: "b", score: 25, maxScore: 50, weight: 30 }),
      makeAssessment({ id: "c", score: null, maxScore: 40, weight: 20 }),
      makeAssessment({ id: "d", score: null, maxScore: 60, weight: 30 }),
    ];
    const result = requiredMarksPerRemaining(items, Grade.HD);
    expect(result["c"].requiredPctOnItem).toBeGreaterThan(100);
  });
});
