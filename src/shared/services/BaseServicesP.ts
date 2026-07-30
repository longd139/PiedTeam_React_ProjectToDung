import type { AxiosInstance } from "axios";
import type { PaginatedResponse, SelectOption } from "../types";
import apiClient from "@/lib/apiClient";

//đầu vào
export interface baseServiceConfig<
  TEntity,
  TCreateDto,
  TUpdateDto,
  TFilterParams,
> {
  endpoint: string;
  axios?: AxiosInstance;

  // các method
  getAll?: (params?: TFilterParams) => Promise<PaginatedResponse<TEntity>>;
  getByID?: (id: string | number) => Promise<TEntity>;
  create?: (data: TCreateDto) => Promise<TEntity>;
  update?: (id: string | number, data: TUpdateDto) => Promise<TEntity>;
  remove?: (id: string) => Promise<void>;
  getSelectOption?: () => Promise<SelectOption[]>;
}
export interface baseService<TEntity, TCreateDto, TUpdateDto, TFilterParams> {
  // các method
  getAll: (params?: TFilterParams) => Promise<PaginatedResponse<TEntity>>;
  getByID: (id: string | number) => Promise<TEntity>;
  create: (data: TCreateDto) => Promise<TEntity>;
  update: (id: string | number, data: TUpdateDto) => Promise<TEntity>;
  remove: (id: string) => Promise<void>;
  getSelectOption: () => Promise<SelectOption[]>;
}

export const createBaseService = <
  TEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TEntity>,
  TFilterParams = Record<string, unknown>,
>(
  config: baseServiceConfig<TEntity, TCreateDto, TUpdateDto, TFilterParams>,
): baseService<TEntity, TCreateDto, TUpdateDto, TFilterParams> => {
  const api = config.axios ?? apiClient; // nếu người dùng truyền vào thì dùng còn nếu như không có thì dùng của api client
  const endpoint = config.endpoint;
  return {
    getAll:
      config.getAll ??
      (async (params?: TFilterParams) => {
        return api.get<PaginatedResponse<TEntity>>(endpoint, {
          params,
        }) as unknown as Promise<PaginatedResponse<TEntity>>;
      }),
    getByID:
      config.getByID ??
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
  };
};
