import { create } from "zustand";
import type { User } from "../types";
import { authApi } from "../api/auth-api";
import { setAccessToken } from "../api/client";

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  login: async (username, password) => {
    const result = await authApi.login(username, password);

    setAccessToken(result.accessToken);
    set({ user: result.user });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      set({ user: null });
    }
  },

  checkAuth: async () => {
    try {
      const user = await authApi.getMe();
      set({ user });
    } catch {
      setAccessToken(null);
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },
}));
