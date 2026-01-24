import axiosClient from "@/lib/axios";

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

export const signinService = async () => {
  const response = await axiosClient.post("/auth/login");
  return response.data;
};

export const forgotPasswordService = async (email: string): Promise<void> => {
  await axiosClient.post(`/auth/forgot-password`, { email });
};

export const verifyOtpService = async (
  email: string,
  otp: string,
): Promise<void> => {
  await axiosClient.post(`/auth/verify-otp`, { email, otp });
};

export const resendOtpService = async (email: string): Promise<void> => {
  await axiosClient.post("/auth/resend-otp", { email });
};

export const resetPasswordService = async (
  email: string,
  newPassword: string,
): Promise<void> => {
  await axiosClient.post(`/auth/reset-password`, {
    email,
    newPassword,
  });
};
