// import { useAuthStore } from "@/stores/auth.store";
import { useAuthStore } from "@/features/auth/store";
import axios from "axios";
import { env } from "./env";
import { toast } from "sonner";
// create instance
const apiClient = axios.create({
  baseURL: env.API_URL, // config .env
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000, // 10s
  withCredentials: true,
});

// request interceptor: attach token
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false; // biến này kiểm tra xem có gọi hàng đợi không
let failQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failQueue.forEach((p) => {
    if (token) p.resolve(token);
    else p.reject(error);
  });
  failQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    return response.data?.data !== undefined
      ? response.data.data
      : response.data;
    // Phase 3 step 1: Return data trực tiếp
    // component sẽ nhận đưuọc user thay vì {data: {result: user}}
    // tuy nhiên, để linh hoạt, ta có thể trả về response.data
  }, // Refresh Token Flow
  async (error) => {
    const originalRequest = error.config;
    const notAuthReqs = !originalRequest.url?.includes("/auth/");
    const is401 = error.response?.status === 401;
    const notRetriedYet = !originalRequest._retry;

    if (notAuthReqs && notRetriedYet && is401) {
      // case 1: đang có request khác đang refresh -> vào queue
      // đang đứng t2 trở đi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          // lưu resolve và reject
          failQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      // case 2: đây là request đầu tiên bị 401
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${env.API_URL}auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );
        const newToken: string =
          response.data?.data?.accessToken ?? response.data?.accessToken;

        useAuthStore.getState().setAuth({
          accessToken: newToken,
          role: useAuthStore.getState().role,
        });

        // xử lý queue
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        // reject queue
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        toast.error("Phiên bản đăng nhập hết hạn. Vui lòng đăng nhập lại !");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // xử lý lỗi chung 400 403 404 500
    const message =
      error.response?.data?.message ?? error.message ?? "Đã có lỗi xảy ra !";

    const isLogoutEndpoint = originalRequest.url?.includes("/auth/logout");
    if (!isLogoutEndpoint) {
      toast.error(message);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
