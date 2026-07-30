import { useAuthStore } from "@/features/auth/store";
import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuthStore } from "../../stores/auth.store";

export default function RequireUnAuth() {
  // 1. Check Token trong thiết bị (Mock bằng localStorage)
  // const token = localStorage.getItem("accessToken");
  const token = useAuthStore((state) => state.accessToken);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";

  if (token) {
    // 2. Không có token -> Đá về /login
    // replace: đè lịch sử, state: lưu địa chỉ cũ để quay lại sau
    return <Navigate to={from} state={{ from: location }} replace />;
  }

  // 3. Có token -> Cho đi tiếp vào các tầng bên trong
  return <Outlet />;
}
