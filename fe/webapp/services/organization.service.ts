import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export const ViewBusinessPageService = (
  accessToken: string,
  page: number,
  size: number,
) =>
  axios.get(`${API_GATEWAY_URL}/org/business-pages`, {
    params: {
      page,
      size,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
