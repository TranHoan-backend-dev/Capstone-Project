import axios from "axios";
import { cookies } from "next/headers";
import { API_GATEWAY_URL } from "@/utils/constraints";

export const createAxiosServer = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  return axios.create({
    baseURL: API_GATEWAY_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  });
};
