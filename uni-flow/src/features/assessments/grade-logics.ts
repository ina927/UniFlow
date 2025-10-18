import { Assessment } from "@/entities/assessments/entities";
import { Grade } from "@/entities/assessments/enums";

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

/** Helper: sum of weights for ungraded items */
export function remainingWeightSum(items: Assessment[]): number {
  return items
    .filter((it) => !isGraded(it))
    .reduce((acc, it) => acc + (it.weight || 0), 0);
}

/**
 * Distribute the remaining requirement equally (in %) across ALL ungraded items,
 * then convert that % to raw marks per item.
 *
 * Logic:
 *  - remain = neededToReach(items, goal)                  // percentage points on the 0–100 overall scale
 *  - sumRemainW = sum(weight of ungraded items)           // total remaining weight
 *  - sharedPct = (remain / sumRemainW) * 100              // same % required on EACH remaining item
 *  - itemRaw = (sharedPct / 100) * item.maxScore          // convert % to raw mark per item
 *
 * Notes:
 *  - When sumRemainW <= 0 -> return empty map (nothing left to distribute)
 *  - If sharedPct > 100 -> even full marks on all remaining items cannot reach the goal
 *    (the UI can show "Goal unreachable" for those rows).
 */
export function requiredMarksPerRemaining(
  items: Assessment[],
  goal: Grade
): Record<string, { requiredPctOnItem: number; requiredRawScore: number }> {
  const remain = neededToReach(items, goal);               // e.g., 29.7
  const sumRemainW = remainingWeightSum(items);            // e.g., 40

  const result: Record<string, { requiredPctOnItem: number; requiredRawScore: number }> = {};
  if (sumRemainW <= 0) return result;

  const sharedPct = (remain / sumRemainW) * 100;           // e.g., 29.7/40*100 = 74.25%

  for (const it of items) {
    if (isGraded(it)) continue;                            // show only for ungraded items
    const w = it.weight || 0;
    const max = it.maxScore || 0;

    if (w <= 0 || max <= 0) {
      // Invalid item definition -> mark as impossible so UI can highlight
      result[it.id] = { requiredPctOnItem: Infinity, requiredRawScore: Infinity };
      continue;
    }

    const raw = (sharedPct / 100) * max;                   // convert % to raw
    const roundedRaw = Math.ceil(raw * 10) / 10;
    result[it.id] = {
        requiredPctOnItem: sharedPct,
        requiredRawScore: roundedRaw,
    };
  }

  return result;
}
