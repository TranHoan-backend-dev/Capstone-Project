import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export const getAllCommunes = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  search?: string | null,
  type?: string | null,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/communes`, {
    params: {
      page,
      size,
      sort,
      search,
      type,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
