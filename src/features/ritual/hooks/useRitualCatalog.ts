import { useQuery } from "@tanstack/react-query";
import type { RitualFilterParams } from "../type";
import { ritualService } from "../services";

export const useRitualCatalog = (params?: RitualFilterParams) => {
    const query = useQuery({
        queryKey: ["ritualCatalog", params],
        queryFn: () => ritualService.getAll(params),
    });
    return {
        rituals: query.data?.data || [],
        pagination: query.data?.meta, // thông tin phân trang
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
        error: query.error,
    };
};
