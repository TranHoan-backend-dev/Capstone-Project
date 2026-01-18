import axios from "axios";
import { NEXT_PUBLIC_API_GATEWAY } from "@/utils/constraints";

const axiosClient = axios.create({
  baseURL: NEXT_PUBLIC_API_GATEWAY,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      "Có lỗi xảy ra, vui lòng thử lại";
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
