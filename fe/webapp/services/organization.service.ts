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

export const updateBusinessPage = (
  accessToken: string,
  id: string,
  name: string,
  activate: string,
  updator: string,
) => {
  return axios.put(
    `${API_GATEWAY_URL}/org/business-pages/${id}`,
    { name, activate, updator },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteBusinessPage = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/org/business-pages/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
