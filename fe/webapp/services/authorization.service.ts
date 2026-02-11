import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export const ViewAccessRightsService = (
  accessToken: string,
  page: number,
  size: number,
  isEnabled?: boolean,
  username?: string,
) =>
  axios.get(`${API_GATEWAY_URL}/auth/authorization/employees`, {
    params: {
      page,
      size,
      isEnabled,
      username,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

