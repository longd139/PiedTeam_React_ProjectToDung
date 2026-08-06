// import { query } from "@/lib/queryClient";
import { jwtDecode } from "jwt-decode";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi, type AuthResponse } from "../services";
import { useAuthStore } from "../store";
import type { LoginSchemaType } from "../schema";
import type { JwtPayload } from "../type";

// register mutation
export const useRegisterMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (userData: {
      fullName: string;
      email: string;
      password: string;
    }) => authApi.register(userData), // khi gọi hàm này thì khả năng sẽ trả ra 2 kết quả
    onSuccess: () => {
      toast.success("Register successfull !", {
        description: "Sign in to continue.",
      });
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Register failed !");
    },
    onSettled: () => {
      // thằng này sẽ là thằng cuối cùng dù có lỗi hay không thì nó vẫn chạy
      // có thể dùng để reset form hoặc các thao tác clean up
    },
  });
};

// Login mutation
export const useLoginMutation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, LoginSchemaType>({
    mutationFn: (userData: { email: string; password: string }) =>
      authApi.login(userData),

    onSuccess: (response) => {
      const decoded = jwtDecode<JwtPayload>(response.accessToken);
      setTokens({ accessToken: response.accessToken, role: decoded.role });

      toast.success("Login successfull !", {
        description: "Wellcome !",
      });

      if (decoded.role === "admin") {
        // (decoded.role);

        navigate("/admin/rituals", { replace: true });
      } else {
        navigate(location, { replace: true });
      }
    },
    // onError: (error: any) => {
    //   toast.error(error.response?.data?.message || "Login failed !");
    // },
    // onSettled: () => {
    //   // thằng này sẽ là thằng cuối cùng dù có lỗi hay không thì nó vẫn chạy
    //   // có thể dùng để reset form hoặc các thao tác clean up
    // },
  });
};

// Logout mutation
export const useLogoutMutation = () => {
  const token = useAuthStore((state) => state.accessToken || "");
  const removeToken = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => {
      return authApi.logout({ accessToken: token });
    },
    onSuccess: () => {
      removeToken();
      queryClient.removeQueries();
      toast.info("Đã đăng xuất");
      // 3. Redirect
      navigate("/login");

      // navigate("/");
    },
    onError: () => {
      // Dù API lỗi, Client vẫn phải Logout để đảm bảo UX
      removeToken();
      queryClient.removeQueries();
      navigate("/login");
    },
    onSettled: () => {
      // thằng này sẽ là thằng cuối cùng dù có lỗi hay không thì nó vẫn chạy
      // có thể dùng để reset form hoặc các thao tác clean up
    },
  });
};
