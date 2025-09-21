"use client";

import { Card, CardContent, CardHeader, Button, Progress } from "@/shared/ui";

type Props = {
  title: string;
  typeLabel: string;
  weight: number;
  maxScore: number;
  dueDateLabel: string;
  description: string;
  score: number | null | undefined;
  percent: number | null; // 0~100 or null
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export const AssessmentDetailCard = ({
  title,
  typeLabel,
  weight,
  maxScore,
  dueDateLabel,
  description,
  score,
  percent,
  onBack,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <Card className="mt-4 p-4">
      <CardHeader className="p-6 pb-3">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-title1-bold text-primary">
            <button onClick={onBack}>←</button>
            {"  "}{"  "}{title}
          </h1>
          <div className="flex items-center gap-2">
            <Button onClick={onEdit}>Edit</Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-3 space-y-8 mt-6 ml-6">
        <div className="grid grid-cols-[140px_1fr] gap-y-5 gap-x-24">
          <p className="text-body1-semibold text-tertiary">Type</p>
          <p className="text-body1 text-primary">{typeLabel}</p>

          <p className="text-body1-semibold text-tertiary">Weight</p>
          <p className="text-body1 text-primary">{weight}%</p>

          <p className="text-body1-semibold text-tertiary">Max Score</p>
          <p className="text-body1 text-primary">{maxScore}</p>

          <p className="text-body1-semibold text-tertiary">Due Date</p>
          <p className="text-body1 text-primary">{dueDateLabel}</p>
          <p className="text-body1-semibold text-tertiary">Description / memo</p>
          <p className="text-body1 text-primary">{description || "-"}</p>
        </div>

        <div className="border-y border-border py-4 w-150">
            <div className="grid grid-cols-[140px_1fr] gap-y-3 gap-x-24">
                <p className="text-body1-semibold text-tertiary">Score</p>
                <div className="text-body1-regular text-primary flex items-center gap-2">
                    {score != null ? (
                        <>
                        <span className="font-bold">{score}</span>
                        / {maxScore}
                        {percent != null && <span>({percent}%)</span>}
                        
                        </>
                    ) : (
                        <>—</>
                    )}
                </div>
                    <Progress value={percent ?? 0} className="h-4 w-120" />
            </div>
        </div>   
      </CardContent>
    </Card>
  );
}
