import { useAuthStore } from "@/features/auth/store";
import type { UserRole } from "@/shared/types";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole[];
}
// guar kiểm tra đăng nhập và role trước khi re
export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const location = useLocation();
  const { accessToken, role } = useAuthStore();
  if (!accessToken) {
    return <Navigate to={"/login"} state={{ from: location }} replace />;
  }
  if (allowedRole && role && !allowedRole.includes(role)) {
    return <Navigate to={"/unauthorized"} replace />;
  }
  return <>{children}</>;
}
