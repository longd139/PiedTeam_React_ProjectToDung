import { useAuthStore } from "@/features/auth/store";
import type React from "react";
import { Navigate } from "react-router-dom";

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { accessToken, role } = useAuthStore();
  if (accessToken) {
    const redirectTo = role === "admin" ? "/admin" : "/";
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
}
