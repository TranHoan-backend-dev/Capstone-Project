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
export interface ForgotPasswordResponse {
  status: number;
  message: string;
  data: string;
  timestamp: string;
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

export const checkExistenceService = async (
  value: string,
): Promise<boolean> => {
  const res = await axios.post(`${API_GATEWAY_URL}/auth/auth/check-existence`, {
    value,
  });
  return res.data.data;
};

export const sendOtpService = async (
  email: string,
): Promise<ForgotPasswordResponse> => {
  const res = await axios.post<ForgotPasswordResponse>(
    `${API_GATEWAY_URL}/auth/auth/send-otp`,
    { email },
  );
  return res.data;
};

export const verifyOtpService = async (
  email: string,
  otp: string,
): Promise<ForgotPasswordResponse> => {
  const res = await axios.post(`${API_GATEWAY_URL}/auth/auth/verify-otp`, {
    email,
    otp,
  });
  return res.data;
};

export const resendOtpService = async (email: string): Promise<void> => {
  await axiosBase.post("/auth/resend-otp", { email });
};

export const resetPasswordService = async (
  email: string,
  otp: string,
  newPassword: string,
): Promise<void> => {
  await axios.post(`${API_GATEWAY_URL}/auth/auth/reset-password`, {
    email,
    otp,
    newPassword,
  });
};

export const changePasswordService = async (
  oldPassword: string,
  newPassword: string,
): Promise<void> => {
  await axiosClient.post("/auth/change-password", {
    oldPassword,
    newPassword,
  });
};
