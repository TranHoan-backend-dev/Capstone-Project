import axiosBase from "@/lib/axios/axios-base";
import { keycloakLogout } from "./keycloak.service";
import axios from "axios";
import { API_GATEWAY_URL } from "@/utils/constraints";

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

export const signinService = (accessToken: string) =>
  axios.post(
    `${API_GATEWAY_URL}/auth/auth/login`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

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
