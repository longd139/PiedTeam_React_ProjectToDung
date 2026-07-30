import type { UserRole } from "@/shared/types";

export interface AuthState {
  // đây là 2 prop mà mình muốn lưu
  accessToken: string | null;
  role: UserRole | null;
}
export interface AuthAction {
  // action
  setAuth: (payload: { accessToken: string; role: UserRole | null }) => void;
  clearAuth: () => void;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
