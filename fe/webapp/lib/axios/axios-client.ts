import axios from "axios";
import { API_GATEWAY_URL } from "@/utils/constraints";

export const createAxiosClient = (access_token?: string) => {
  return axios.create({
    baseURL: "http://localhost:8000",
    headers: {
      "Content-Type": "application/json",
      ...(access_token && {
        Authorization: `Bearer ${access_token}`,
      }),
    },
  });
};
