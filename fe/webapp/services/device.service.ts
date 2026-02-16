import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export const getAllMaterials = (
  accessToken: string,
  page: number,
  size: number,
) =>
  axios.get(`${API_GATEWAY_URL}/device/materials`, {
    params: {
      page,
      size,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  