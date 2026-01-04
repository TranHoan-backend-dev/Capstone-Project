import "server-only";

import { AUTH_API_URL } from "@/utils/constraints";

export interface LoginRequest {
  username: string;
  password: string;
}

export const login = async (request: LoginRequest) => {
  const response = await fetch(`${AUTH_API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  return await response.json();
};

export const logout = async (accessToken: string) => {
  try {
    await fetch(`${AUTH_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email: string, newPassword: string) => {
  const response = await fetch(`${AUTH_API_URL}/reset-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, newPassword }),
  });

  if (!response.ok) {
    throw new Error("Failed to reset password");
  }

  return response.status;
};
