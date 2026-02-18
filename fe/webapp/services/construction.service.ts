import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export const getAllNetworks = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  keyword?: string | null,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/networks`, {
    params: {
      page,
      size,
      sort,
      keyword,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createNetwork = (accessToken: string, name: string) => {
  return axios.post(
    `${API_GATEWAY_URL}/construction/networks`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};
