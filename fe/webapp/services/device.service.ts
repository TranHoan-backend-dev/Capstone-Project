import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export const getAllUnits = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  filter?: string | null,
) =>
  axios.get(`${API_GATEWAY_URL}/d/units`, {
    params: {
      page,
      size,
      sort,
      filter,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });