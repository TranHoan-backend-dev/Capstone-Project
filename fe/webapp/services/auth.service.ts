import axiosBase from "@/lib/axios/axios-base";
import axios from "axios";
import { API_GATEWAY_URL } from "@/utils/constraints";
import {
  ApiResponse,
  EmployeeProfileData,
  EmployeeProfileUpdatePayload,
} from "@/types";

export const signinService = (username: string, password: string) =>
  axios.post(
    `${API_GATEWAY_URL}/auth/auth/login`,
    { username, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

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

export const getProfileEmployee = async (accessToken: string) => {
  return await axios.get(`${API_GATEWAY_URL}/auth/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const updateProfileEmployee = async (
  payload: any,
  accessToken: string,
): Promise<any> => {
  const response = await axios.patch<ApiResponse<any>>(
    `${API_GATEWAY_URL}/auth/me`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  return response.data.data;
};

export const updateAvatar = async (formData: FormData, accessToken: string) => {
  const response = await axios.patch(`${API_GATEWAY_URL}/auth/me`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
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
