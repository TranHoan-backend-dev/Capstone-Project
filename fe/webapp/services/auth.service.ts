import axiosClient from "@/lib/axios";

export interface LoginRequest {
  username: string;
  password: string;
}

export const forgotPasswordService = async (email: string): Promise<void> => {
  await axiosClient.post(`/auth/forgot-password`, { email });
};

export const verifyOtpService = async (email: string, otp: string): Promise<void> => {
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
