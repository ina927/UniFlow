// src/components/ui/DonutGauge.tsx
"use client";
import React from "react";

type DonutGaugeProps = {
  value: number;
  label: string; 
  subLabel?: string;       
  size?: number;           
  trackThickness?: number;
  progressThickness?: number;  
  trackColor?: string;
  progressColor?: string;
  goalMarker?: number;     
  goalColor?: string;      
  goalThickness?: number;  
};

export const DonutGauge = ({
  value,
  label,
  subLabel,
  size = 200,
  trackThickness = 12,
  progressThickness = 16,
  trackColor = "var(--muted)",
  progressColor = "var(--primary)",
  goalMarker,
  goalColor="#D8DAE5",
  goalThickness = 24,
}: DonutGaugeProps) => {
  const maxStroke = Math.max(trackThickness, progressThickness);
  const radius = (size - maxStroke) / 2;
  const circumference = 2 * Math.PI * radius;

  // progress
  const progress = Math.max(0, Math.min(100, value));
  const dash = (progress / 100) * circumference;
  const gap = circumference - dash;

  // goal marker 
  const goal = goalMarker !== undefined ? Math.max(0, Math.min(100, goalMarker)) : undefined;
  const goalDash = goal !== undefined ? (goal / 100) * circumference : 0;
  const goalGap = goal !== undefined ? circumference - goalDash : 0;

  return (
    <div style={{ width: size, height: size, position: "relative" }} aria-label={`gauge ${label} ${progress.toFixed(1)}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size/2} ${size/2})`}>
          {/* base track */}
          <circle
            cx={size/2}
            cy={size/2}
            r={radius}
            stroke={trackColor}
            strokeWidth={trackThickness}
            fill="none"
            strokeLinecap="round"
          />
          {/* goal marker */}
          {goal !== undefined && (
            <circle
              cx={size/2}
              cy={size/2}
              r={radius}
              stroke={goalColor}
              strokeWidth={goalThickness ?? Math.max(2, progressThickness * 0.35)}
              fill="none"
              strokeDasharray={`${goalDash} ${goalGap}`}
              strokeLinecap="butt"
            />
          )}
          {/* progress */}
          <circle
            cx={size/2}
            cy={size/2}
            r={radius}
            stroke={progressColor}
            strokeWidth={progressThickness}
            fill="none"
            strokeDasharray={`${dash} ${gap}`}
            strokeLinecap="butt"
          />
        </g>
      </svg>
      {/* center labels */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        lineHeight: 1.1, textAlign: "center"
      }}>
        <div className= "text-title1-bold" style={{color: progressColor, fontSize: 35, fontWeight: 800 }}>{label}</div>
        {subLabel && (
          <div className= "text-title1-bold text-primary" style={{marginLeft: 5}}>
            {subLabel}
          </div>
        )}
      </div>
    </div>
  );
}
