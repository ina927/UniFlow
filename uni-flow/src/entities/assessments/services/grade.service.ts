import type { Assessment } from "../entities/assessment.entity";
import { Grade } from "../enums/Grade";

export const GRADE_THRESHOLDS: Record<Grade, number> = {
    [Grade.HD]: 85,
    [Grade.D ]: 75,
    [Grade.C ]: 65,
    [Grade.P ]: 50,
    [Grade.F ]: 0,
};

/**
 * Check if an assessment has been graded.
 */
export function isGraded(a: Assessment) {
  return a.score !== undefined && a.score !== null && a.maxScore > 0;
}

/**
 * Calculate this item's weighted contribution (0–100%).
 * Formula: (score / maxScore) * weight
 * Example: 18/20 with weight 20% → contributes 18%
 */
export function weightedContribution(a: Assessment) {
  if (!isGraded(a)) return 0;
  return (a.score! / a.maxScore) * a.weight;
}

/**
 * Calculate overall percentage (0–100%) out of the entire subject (100% total).
 * Includes both graded and ungraded items (ungraded count as 0).
 */
export function overallPercent(items: Assessment[]) {
  return items.reduce((acc, it) => acc + weightedContribution(it), 0);
}

/**
 * Calculate the current weighted grade based only on graded items.
 * Example: if only 2 items graded, show weighted average of just those.
 */
export function completedWeightedPercent(items: Assessment[]) {
  const done = items.filter(isGraded);
  const doneWeight = done.reduce((acc, it) => acc + it.weight, 0);
  if (doneWeight <= 0) return 0;
  const gained = done.reduce((acc, it) => acc + weightedContribution(it), 0);
  return (gained / doneWeight) * 100;
}

/**
 * Convert a percentage to a letter grade (HD, D, C, P, F).
 */
export function letterFromPercent(p: number): Grade {
  if (p >= 85) return Grade.HD;
  if (p >= 75) return Grade.D;
  if (p >= 65) return Grade.C;
  if (p >= 50) return Grade.P;
  return Grade.F;
}

/**
 * Calculate how many more percentage points (0–100)
 * are needed to reach a target grade, relative to the overall 100%.
 * Returns 0 if already achieved or exceeded.
 */
export function neededToReach(items: Assessment[], goal: Grade) {
  const now = overallPercent(items);
  const need = GRADE_THRESHOLDS[goal];
  return Math.max(0, need - now);
}

/**
 * If one specific item is the only way to reach the target grade,
 * calculate how much is required on that item.
 *
 * Returns:
 *  - requiredPctOnItem: % score needed on this item (e.g. 78%)
 *  - requiredRawScore: actual score required out of maxScore
 * 
 * If target not found or invalid weight/maxScore → returns null/Infinity.
 */
export function requiredOnSingleItemForGoal(
  items: Assessment[],
  targetId: string,
  goal: Grade
): { requiredPctOnItem: number; requiredRawScore: number } | null {
  const remain = neededToReach(items, goal);
  const target = items.find(i => i.id === targetId);
  if (!target) return null;
  if (target.weight <= 0 || target.maxScore <= 0) {
    return { requiredPctOnItem: Infinity, requiredRawScore: Infinity };
  }
  const requiredPctOnItem = (remain / target.weight) * 100;
  const requiredRawScore  = (requiredPctOnItem / 100) * target.maxScore;
  return { requiredPctOnItem, requiredRawScore };
}