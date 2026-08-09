const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (
    response.status === 401 &&
    !url.includes("/api/auth/login") &&
    !url.includes("/api/auth/refresh")
  ) {
    const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      const result = await refreshResponse.json();

      accessToken = result.data.accessToken;

      headers.set("Authorization", `Bearer ${accessToken}`);

      response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers,
        credentials: "include",
      });
    } else {
      accessToken = null;
      throw new Error("Session expired. Please login again.");
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data.data ?? data;
}
