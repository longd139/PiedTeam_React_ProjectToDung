import { createBaseService } from "@/shared/services/BaseService";
import type {
  CreateRitualDto,
  Ritual,
  RitualFilterParams,
  UpdateRitualDto,
} from "./type";
import type { BaseFilterParams } from "@/shared/types";

export const ritualService = createBaseService<
  Ritual,
  CreateRitualDto,
  UpdateRitualDto,
  RitualFilterParams
>({
  endpoint: "/ritual",
});
export const ritualServicePage = createBaseService<
  Ritual,
  CreateRitualDto,
  UpdateRitualDto,
  BaseFilterParams
>({
  endpoint: "/ritual",
});
