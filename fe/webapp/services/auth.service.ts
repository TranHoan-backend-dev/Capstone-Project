import { createAxiosClient } from "@/lib/axios/axios-client";
import axiosBase from "@/lib/axios/axios-base";
import { keycloakLogout } from "./keycloak.service";
import { ApiResponse, EmployeeProfileData } from "@/types";

export interface SigninRequest {
  username: string;
  password: string;
}

export interface SigninResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export const signinService = async (access_token: string) => {
  const axiosClient = createAxiosClient(access_token);
  const response = await axiosClient.get("/auth/me");
  return response.data;
};

export const forgotPasswordService = async (email: string): Promise<void> => {
  await axiosBase.post(`/auth/forgot-password`, { email });
};

export const verifyOtpService = async (
  email: string,
  otp: string,
): Promise<void> => {
  await axiosBase.post(`/auth/verify-otp`, { email, otp });
};

export const resendOtpService = async (email: string): Promise<void> => {
  await axiosBase.post("/auth/resend-otp", { email });
};

export const resetPasswordService = async (
  email: string,
  newPassword: string,
): Promise<void> => {
  await axiosBase.post(`/auth/reset-password`, {
    email,
    newPassword,
  });
};

export const getProfileEmployee = async (): Promise<EmployeeProfileData> => {
  const response = await axiosClient.get<ApiResponse<EmployeeProfileData>>(
    "/auth/me"
  );
  return response.data.data;
};

export const logoutService = async () => {
  if (typeof window === "undefined") return;

  const refreshToken = localStorage.getItem("refresh_token");

  try {
    await keycloakLogout(refreshToken ?? undefined);
  } catch (err) {
    console.warn("Keycloak logout failed", err);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }
};
