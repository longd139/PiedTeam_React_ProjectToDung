import { useQuery } from "@tanstack/react-query";

import type { RitualCategory } from "../type";
import apiClient from "@/lib/apiClient";
import type { PaginatedResponse } from "@/shared/types";

export const useRitualCategories = () => {
  return useQuery({
    queryKey: ["ritualCategories"],
    queryFn: async (): Promise<PaginatedResponse<RitualCategory>> => {
      const response =
        await apiClient.get<PaginatedResponse<RitualCategory>>(
          "/ritual-category",
        );
      return response as unknown as PaginatedResponse<RitualCategory>;
    },
  });
};
