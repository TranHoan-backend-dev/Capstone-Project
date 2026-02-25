import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export const ViewBusinessPageService = (
  accessToken: string,
  page: number,
  size: number,
  filter?: string,
  isActive?: boolean,
) =>
  axios.get(`${API_GATEWAY_URL}/org/business-pages`, {
    params: {
      page,
      size,
      filter,
      isActive,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
