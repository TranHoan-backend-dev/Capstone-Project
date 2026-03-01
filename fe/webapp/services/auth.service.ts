import axiosBase from "@/lib/axios/axios-base";
import axios from "axios";
import { API_GATEWAY_URL } from "@/utils/constraints";
import {
  ApiResponse,
  EmployeeProfileData,
  EmployeeProfileUpdatePayload,
} from "@/types";

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

export const verifyOtpService = async (email: string, otp: string) => {
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
) => {
  const res = await axios.post(`${API_GATEWAY_URL}/auth/auth/reset-password`, {
    email,
    otp,
    newPassword,
  });

  return res.data;
};

export const getProfileEmployee = async (
  accessToken: string,
): Promise<EmployeeProfileData> => {
  const response = await axios.get<ApiResponse<EmployeeProfileData>>(
    `${API_GATEWAY_URL}/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response.data.data;
};

export const updateProfileEmployee = async (
  payload: Partial<EmployeeProfileUpdatePayload>,
  accessToken: string,
): Promise<EmployeeProfileUpdatePayload> => {
  const response = await axios.post<ApiResponse<EmployeeProfileUpdatePayload>>(
    `${API_GATEWAY_URL}/auth/me`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data.data;
};

export const updateAvatar = async (file: File, accessToken: string) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await axios.put(`${API_GATEWAY_URL}/auth/me`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

export const checkExistenceService = async (
  email: string,
): Promise<boolean> => {
  const res = await axios.post(`${API_GATEWAY_URL}/auth/auth/check-existence`, {
    value: email,
  });

  return res.data.data;
};

export const sendOtpService = async (email: string) => {
  const res = await axios.post(`${API_GATEWAY_URL}/auth/auth/send-otp`, {
    email,
  });

  return res.data;
};

export const changePasswordService = async (
  accessToken: string,
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
) => {
  const res = await axios.post(
    `${API_GATEWAY_URL}/auth/auth/change-password`,
    {
      oldPassword,
      newPassword,
      confirmPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return res.data;
};
