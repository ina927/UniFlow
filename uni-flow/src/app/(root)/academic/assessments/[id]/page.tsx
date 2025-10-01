"use client";

import { useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

import { SubjectHeader, TutorInfoCard, EditAssessmentModal, AssessmentDetailCard } from "@/widgets/assessments/ui";
import { ConfirmDialog } from "@/widgets/common/ui";
import {
  useAssessmentsQuery,
  useDeleteAssessment,
} from "@/features/assessments/hooks/useAssessmentsQuery";
import { useSubjectDetailQuery } from "@/features/academics/hooks/useSubjectDetailQuery";
import styles from "../page.module.css";

function fmtDate(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AssessmentDetailPage() {
  const { id } = useParams<{ id: string }>(); // /assessments/[id]
  const search = useSearchParams();
  const subjectId = search.get("subjectId") ?? "";
  const router = useRouter();

  // subject + assessments
  const { data: subject } = useSubjectDetailQuery(subjectId);
  const { data: list = [], isLoading } = useAssessmentsQuery(subjectId);
  const totalWeight = useMemo(
    () => list.reduce((acc, it) => acc + (Number(it.weight) || 0), 0),
    [list]
  );

  const item = useMemo(() => list.find((i) => i.id === id) ?? null, [list, id]);

  // edit & delete
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const del = useDeleteAssessment(subjectId);

  // derived % (0–100) or null
  const percent =
    item && item.maxScore > 0 && item.score != null
      ? Math.round((item.score / item.maxScore) * 100)
      : null;

  if (isLoading) {
    return (
      <div className={`${styles.detailContainer} text-muted-foreground`}>Loading…</div>
    );
  }
  if (!item) {
    return (
      <div className={styles.detailContainer}>
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-primary">Assessment not found</div>
          <button
            className="text-sm underline text-primary"
            onClick={() => router.push(`/academic/assessments?subjectId=${subjectId}`)}
          >
            ← Back to list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.detailContainer}>
      {/* Subject Info (SubjectHeader / TutorInfoCard) */}
      <div className={styles.headerRow}>
        <div className={styles.left}>
          <SubjectHeader
            subjectName={subject?.title ?? "—"}
            subjectCode={subject?.code ?? "—"}
            term={subject?.termTitle ?? "—"}
            year={subject?.academicYear ?? new Date().getFullYear()}
            creditPoint={subject?.credits ?? 0}
          />
        </div>
        <div className={styles.right}>
          <TutorInfoCard
            tutorEmail={subject?.labTutorEmail ?? "-"}
            coordinatorEmail={subject?.coordinatorEmail ?? "-"}
          />
        </div>
      </div>

      {/* Assessment Details */}
      <AssessmentDetailCard
        title={item.title}
        typeLabel={String(item.type)}
        weight={item.weight}
        maxScore={item.maxScore}
        dueDateLabel={fmtDate(item.dueDate)}
        description={item.description ?? ""}
        score={item.score}
        percent={percent}
        onBack={() => router.push(`/academic/assessments?subjectId=${subjectId}`)}
        onEdit={() => setOpenEdit(true)}
        onDelete={() => setOpenDelete(true)}
      />

      {/* Edit (prefilled) */}
      <EditAssessmentModal
        open={openEdit}
        onOpenChange={setOpenEdit}
        subjectId={subjectId}
        initial={item}
        currentTotalWeight={totalWeight}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={openDelete}
        onOpenChange={setOpenDelete}
        title="Delete assessment?"
        message={`"${item.title}" will be permanently deleted.`}
        confirmText={del.isPending ? "Deleting..." : "Delete"}
        onConfirm={() =>
          del.mutate(item.id, {
            onSuccess: () => router.push(`/academic/assessments?subjectId=${subjectId}`),
          })
        }
      />
    </div>
  );
}
