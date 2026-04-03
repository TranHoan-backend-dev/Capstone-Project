import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export const getAllNotifications = (
  accessToken: string,
  page: number,
  size: number,
) =>
  axios.get(`${API_GATEWAY_URL}/n/notification`, {
    params: {
      page,
      size,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
