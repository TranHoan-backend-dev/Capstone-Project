import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export const getAllNetworks = (
  accessToken: string,
  page: number,
  size: number,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/networks`, {
    params: {
      page,
      size,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
