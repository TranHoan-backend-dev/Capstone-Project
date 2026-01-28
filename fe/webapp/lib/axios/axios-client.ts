import axiosBase from "./axios-base";

export const createAxiosClient = (accessToken?: string) => {
  const instance = axiosBase;

  if (accessToken) {
    instance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }

  return instance;
};
