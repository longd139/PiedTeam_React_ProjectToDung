// import apiClient from "../http/apiClient";

import apiClient from "@/lib/apiClient";

// define interface
export interface AuthResponse {
  accessToken: string;
  // refreshToken: string;
  subscription?: {
    hasActiveSubscription: boolean;
    subscriptionStatus?: string;
  };
}

interface User {
  _id: string;
  email: string;
  fullName: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  fullName: string;
}
export const authApi = {
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(
      "/auth/login",
      credentials,
    ) as unknown as Promise<AuthResponse>;
  },
  async register(credentials: RegisterDTO): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(
      "/auth/register",
      credentials,
    ) as unknown as Promise<AuthResponse>;
  },
  async getMe(): Promise<User> {
    const data = (await apiClient.get("/user/me")) as any;
    // backend trả: {message, result:{access_token, refresh_token}}
    // fe nhận : {accessToken,refreshToken}
    // console.log({data.id})
    return {
      _id: data.id,
      email: data.email,
      fullName: data.fullName,
    };
  },
  async logout(credentials: {
    accessToken: string;
  }): Promise<{ message: string }> {
    const data = await apiClient.post("/auth/logout", credentials);
    // console.log(data);

    return {
      message: data.data.message,
    };
  },
};
