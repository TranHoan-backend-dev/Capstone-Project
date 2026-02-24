import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export const getAllDepartments = (
  accessToken: string,
  page: number,
  size: number,
  keyword?: string | null,
) =>
  axios.get(`${API_GATEWAY_URL}/org/departments`, {
    params: {
      page,
      size,
      keyword,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });