import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAssessments, 
  getAssessment,
  createAssessmentApi, 
  enterScoreApi, 
  updateAssessmentApi, 
  deleteAssessmentApi 
} from "../apis/assessment.api";
import type { Assessment } from "@/entities/assessments/entities";
import { EnterScoreDto, CreateAssessmentDto } from "@/entities/assessments/dto";

// Fetches the list of assessments for a specific subject
export function useAssessmentsQuery(subjectId: string) {
  return useQuery<Assessment[]>({
    queryKey: ["assessments", subjectId],
    enabled: !!subjectId,
    queryFn: async () => {
      const list = await getAssessments(subjectId);
      return list ?? [];
    },
    initialData: [],
  });
}

// Creates a new assessment and invalidates the related cache entry
export function useCreateAssessment(subjectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateAssessmentDto) => createAssessmentApi(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assessments", subjectId] }),
  });
}

// Submits a score entry for a specific assessment
export function useEnterScore(subjectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: EnterScoreDto & { score: number | null }) => enterScoreApi(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assessments", subjectId] }),
  });
}

// Retrieves detailed information for a single assessment
export function useAssessmentDetailQuery(id: string) {
  return useQuery({
    queryKey: ["assessment", id],
    enabled: !!id,
    queryFn: () => getAssessment(id),
  });
}

// Updates an existing assessment record
export function useUpdateAssessment(subjectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: CreateAssessmentDto }) =>
      updateAssessmentApi(id, dto),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["assessments", subjectId] });
      qc.invalidateQueries({ queryKey: ["assessment", vars.id] });
    },
  });
}

// Deletes an assessment by ID
export function useDeleteAssessment(subjectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAssessmentApi(id),
    onSuccess: (_res, id) => {
      qc.invalidateQueries({ queryKey: ["assessments", subjectId] });
      qc.removeQueries({ queryKey: ["assessment", id] });
    },
  });
}