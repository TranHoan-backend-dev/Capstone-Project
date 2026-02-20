import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export const getAllLaterals = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  keyword?: string | null,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/laterals`, {
    params: {
      page,
      size,
      sort,
      keyword,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createLateral = (
  accessToken: string,
  name: string,
  type: string,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/construction/laterals`,
    { name, type },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const updateLateral = (
  accessToken: string,
  id: string,
  name: string,
) => {
  return axios.put(
    `${API_GATEWAY_URL}/construction/laterals/${id}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteLateral = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/construction/laterals/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
