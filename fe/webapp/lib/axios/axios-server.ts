import { cookies } from "next/headers";
import  axiosBase from "./axios-base";

export const createAxiosServer = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const instance = axiosBase;

  if (token) {
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  return instance;
};
