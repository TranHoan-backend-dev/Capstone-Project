import axios from "axios";

const axiosBase = axios.create({
  withCredentials: true,
});

let isRefreshing = false;
let queue: any[] = [];

axiosBase.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then(() => axiosBase(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        queue.forEach((p) => p.resolve(axiosBase(originalRequest)));
        queue = [];

        return axiosBase(originalRequest);
      } catch (err) {
        queue.forEach((p) => p.reject(err));
        queue = [];
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosBase;
