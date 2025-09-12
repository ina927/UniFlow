import { useQuery } from "@tanstack/react-query";
import { SubjectEntity } from "@/entities";
import { apiClient } from "@/shared/api";

export function useSubjectsQuery() {
  return useQuery<SubjectEntity[]>({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get("/subjects");
      return res.data;
    },
    staleTime: 1000 * 60,
  });
}
