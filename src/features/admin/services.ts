import apiClient from "@/lib/apiClient";
import type { RitualsSchema } from "./type";

export const ritualApi = {
  async getAllRitual(): Promise<RitualsSchema> {
    const res = await apiClient.get("/ritual");

    return res.data;
  },
};
