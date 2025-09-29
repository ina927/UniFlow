"use client";

import { DonutGauge } from "@/shared/ui/donut-gauge";
import { Grade } from "@/entities/assessments";
import {
  overallPercent,
  completedWeightedPercent,
  letterFromPercent,
  neededToReach,
  GRADE_THRESHOLDS,
} from "@/features/assessments/grade-logics";
import type { Assessment } from "@/entities/assessments";

import styles from "./GradeSummary.module.css";

type Props = {
  goal: Grade;          
  items: Assessment[];
};

function fmtPct(p: number) {
  const n = Number.isInteger(p) ? p : Number(p.toFixed(1));
  return `${n}`;
}

export const GradeSummary = ({ goal, items}: Props) => {
  const completedPct = completedWeightedPercent(items);     
  const completedLetter = letterFromPercent(completedPct); 

  const overallPct = overallPercent(items);                
  const overallLetter = letterFromPercent(overallPct);   

  const goalCut = GRADE_THRESHOLDS[goal];                  
  const needed = neededToReach(items, goal);              

  return (
    <aside className={styles.panel} aria-label="grade summary">
      <div>
        <span className="text-body1-bold text-primary">Goal Grade:</span>
        <span className={`text-title2-bold primary-light ${styles.goal}`}>{goal}</span>
      </div>

      <div className={styles.block}>
        <div className={`text-body1-bold text-primary ${styles.blockTitle}`}>Current Weighted Grade: 
        <span className="text-body1 text-primary">(Completed Only)</span>
        </div>
        <DonutGauge
          value={completedPct}
          label={completedLetter}
          subLabel={fmtPct(completedPct) + "%"}
          goalMarker={goalCut}
          trackThickness={18}
          progressThickness={24}
        />
      </div>

      <div className={styles.block}>
          <div className={`text-body1-bold text-primary ${styles.blockTitle}`}>Overall Grade:
          <div className="text-body1 text-primary">(All Assessment)</div>
          </div>
          <DonutGauge
              value={overallPct}
              label={overallLetter}
              subLabel={fmtPct(overallPct) + "%"}
              goalMarker={goalCut}
              trackThickness={18}
              progressThickness={24}
              progressColor="#F2808E"
          />
          <div className={`text-body1-bold text-primary ${styles.required}`}>
              {"> "}<span style={{color: "#F2808E"}}>{fmtPct(needed)}</span>% required to reach {goal}
          </div>
        </div>
    </aside>
  );
}
