import { apiFetch } from "./client";
import type { User } from "../types";

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export const authApi = {
  login: (username: string, password: string) =>
    apiFetch<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  logout: () =>
    apiFetch<{ message: string }>("/api/auth/logout", {
      method: "POST",
    }),

  getMe: () => apiFetch<User>("/api/auth/me"),

  createStaff: (username: string, password: string) =>
    apiFetch<User>("/api/auth/staff", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  getUsers: () => apiFetch<User[]>("/api/auth/users"),

  deleteUser: (id: string) =>
    apiFetch<{ message: string }>(`/api/auth/users/${id}`, {
      method: "DELETE",
    }),
};
