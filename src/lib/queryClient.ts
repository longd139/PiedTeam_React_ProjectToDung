import { QueryClient } from "@tanstack/react-query";
export const query = new QueryClient({
  defaultOptions: {
    queries: {
      // Config mặc định cho tất cả queries

      // 1. refetch on window focus
      refetchOnWindowFocus: "always",
      // mặc định: true tự fetch lại khi user quay lại tab
      // học: tắt để dễ debug (log đỡ nhảy loạn)
      // Production: bật lại để data luôn tươi

      // 2. Retry Failed Request
      retry: 1,
      // mặc định 3 lần
      // học:  giảm xuống 1 để nhanh thấy lỗi
      // Production: 2-3 là hợp lý (network luôn tươi)

      // 3. State Time
      staleTime: 1000 * 1,
      // Mặc định: 0 (data ngay lập tức "cũ")
      // Production: 30s - 5p tùy data

      // 4. cache time (GC Time)
      gcTime: 5 * 60 * 1000,
      // Mặc định 5p
      // cache tồn tại 5p kể từ khi ko còn component nào dùng
    },
  },
});
