import axiosBase from "@/lib/axios/axios-base";
import axios from "axios";
import { API_GATEWAY_URL } from "@/utils/constraints";

// Hàm tạo device fingerprint (chỉ chạy ở client)
export const generateDeviceFingerprint = (): string => {
  if (typeof window === "undefined") return "server-side-fallback";

  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: (navigator as any).deviceMemory || 0,
  };

  const fingerprintString = JSON.stringify(fingerprint);
  let hash = 0;
  for (let i = 0; i < fingerprintString.length; i++) {
    const char = fingerprintString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  return Math.abs(hash).toString(36);
};

// Lấy hoặc tạo deviceId (chỉ chạy ở client)
export const getDeviceId = (): string => {
  if (typeof window === "undefined") return "server-side-fallback";

  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = generateDeviceFingerprint();
    localStorage.setItem("device_id", deviceId);
    console.log("Generated new deviceId:", deviceId);
  } else {
    console.log("Using existing deviceId:", deviceId);
  }
  return deviceId;
};

// Lấy deviceInfo (chỉ chạy ở client)
export const getDeviceInfo = (): string => {
  if (typeof window === "undefined") return "Server-side request";
  return navigator.userAgent;
};

// Service gọi API - KHÔNG gọi navigator ở đây
export const signinService = (
  username: string,
  password: string,
  deviceId: string,
  deviceInfo: string,
) => {
  const requestBody = {
    username,
    password,
    deviceId,
    deviceInfo,
  };

  console.log("Calling backend with body:", requestBody);

  return axios.post(`${API_GATEWAY_URL}/auth/auth/login`, requestBody, {
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });
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

// export const getProfileEmployee = async (
//   accessToken: string,
// ): Promise<EmployeeProfileData> => {
//   const response = await axios.get<ApiResponse<EmployeeProfileData>>(
//     `${API_GATEWAY_URL}/auth/me`,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     },
//   );

//   return response.data.data;
// };
export const getProfileEmployee = async (accessToken: string) => {
  const response = await axios.get(`${API_GATEWAY_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.data;
};
// export const updateProfileEmployee = async (
//   payload: any,
//   accessToken: string,
// ): Promise<any> => {
//   const response = await axios.patch<ApiResponse<any>>(
//     `${API_GATEWAY_URL}/auth/me`,
//     payload,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     },
//   );
//   return response.data.data;
// };
export const updateProfileEmployee = async (
  payload: any,
  accessToken: string,
) => {
  const response = await axios.patch(`${API_GATEWAY_URL}/auth/me`, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
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
