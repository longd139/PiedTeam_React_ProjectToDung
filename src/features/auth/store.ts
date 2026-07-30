import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import type { AuthAction, AuthState } from "./type";
// định nghĩa cái store của mình

export const useAuthStore = create<AuthState & AuthAction>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        accessToken: null,
        role: null,
        // Actions
        setAuth: ({ accessToken, role }) =>
          set({ accessToken: accessToken, role: role }),

        clearAuth: () => set({ accessToken: null, role: null }),
      }),
      {
        name: "shopping-card-auth",
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
