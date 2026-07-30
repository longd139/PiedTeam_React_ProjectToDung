import { useQuery } from "@tanstack/react-query";
import { authApi } from "../services";

export const useUser = () => {
  return useQuery({
    // query key (bắt buộc) -> nó là cái gì ?
    // nó là key của cái bộ nhớ cache
    queryKey: ["me"], // đây là key của cache và nó là unique
    // ---------------
    // key = id của cache
    // cùng key cùng cache
    // khác key khác cache
    // -----------------
    // thì tại sao lại lưu nó thành mảng
    // - dễ nets
    // - dễ invalidate theo pattern
    // - react query so sánh array theo giá trị
    queryFn: authApi.getMe, // chỗ gọi API (gọi service)
  });
};
