import type { PaginatedResponse, SelectOption } from "@/shared/types";
import apiClient from "@/lib/apiClient";
import type { AxiosInstance } from "axios";

//đầu vào
export interface baseServiceConfig<
  TEntity,
  TCreateDto,
  TUpdateDto,
  TFilterParams,
> {
  endpoint: string;
  axios?: AxiosInstance;

  //các method
  getAll?: (params?: TFilterParams) => Promise<PaginatedResponse<TEntity>>;
  getById?: (id: string | number) => Promise<TEntity>;
  create?: (data: TCreateDto) => Promise<TEntity>;
  update?: (id: string | number, data: TUpdateDto) => Promise<TEntity>;
  remove?: (id: string | number) => Promise<void>;
  getSelectOption?: () => Promise<SelectOption[]>;
}

//đầu ra
export interface baseService<TEntity, TCreateDto, TUpdateDto, TFilterParams> {
  //các method
  getAll: (params?: TFilterParams) => Promise<PaginatedResponse<TEntity>>;
  getById: (id: string | number) => Promise<TEntity>;
  create: (data: TCreateDto) => Promise<TEntity>;
  update: (id: string | number, data: TUpdateDto) => Promise<TEntity>;
  remove: (id: string | number) => Promise<void>;
  getSelectOption: () => Promise<SelectOption[]>;
}

//có interface đầu vào và đầu ra => giờ tạo ra nó
export const createBaseService = <
  TEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TEntity>,
  TFilterParams = Record<string, unknown>,
>(
  config: baseServiceConfig<TEntity, TCreateDto, TUpdateDto, TFilterParams>,
): baseService<TEntity, TCreateDto, TUpdateDto, TFilterParams> => {
  const api = config.axios ?? apiClient;
  const endpoint = config.endpoint;

  return {
    getAll:
      config.getAll ??
      (async (params?: TFilterParams) => {
        return api.get<PaginatedResponse<TEntity>>(endpoint, {
          params,
        }) as unknown as Promise<PaginatedResponse<TEntity>>;
      }),

    getById:
      config.getById ??
      (async (id: string | number) => {
        return (await api.get<TEntity>(
          `${endpoint}/${id}`,
        )) as unknown as Promise<TEntity>;
      }),

    create:
      config.create ??
      (async (data: TCreateDto) => {
        return (await api.post<TEntity>(endpoint, {
          data,
        })) as unknown as Promise<TEntity>;
      }),

    update:
      config.update ??
      (async (id: string | number, data: TUpdateDto) => {
        return (await api.put(`${endpoint}/${id}`, {
          data,
        })) as unknown as Promise<TEntity>;
      }),

    remove:
      config.remove ??
      (async (id: string | number) => {
        await api.delete(`${endpoint}/${id}`);
      }),

    getSelectOption:
      config.getSelectOption ??
      (async () => {
        return (await api.get<SelectOption[]>(
          `${endpoint}/select`,
        )) as unknown as Promise<SelectOption[]>;
      }),
  };
};
