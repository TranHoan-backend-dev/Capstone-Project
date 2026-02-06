import axios from "axios";
import { API_GATEWAY_URL } from "@/utils/constraints";

const axiosBase = axios.create({
  baseURL: API_GATEWAY_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosBase.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    } else {
      error.message = "Có lỗi xảy ra, vui lòng thử lại";
    }
    return Promise.reject(error);
  },
);

export default axiosBase;
