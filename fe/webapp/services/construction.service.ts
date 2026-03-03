import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export const getAllCommunes = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  keyword?: string | null,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/communes`, {
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

export const createCommune = (
  accessToken: string,
  name: string,
  type: string,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/construction/communes`,
    { name, type },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const updateCommune = (
  accessToken: string,
  id: string,
  name: string,
  type: string,
) => {
  return axios.put(
    `${API_GATEWAY_URL}/construction/communes/${id}`,
    { name, type },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteCommune = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/construction/communes/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getAllNeighborhoodUnits = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  keyword?: string | null,
  communeId?: string | null,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/units`, {
    params: {
      page,
      size,
      sort,
      keyword,
      communeId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createNeighborhoodUnits = (
  accessToken: string,
  name: string,
  communeId: string,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/construction/units`,
    { name, communeId },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const updateNeighborhoodUnits = (
  accessToken: string,
  id: string,
  name: string,
  communeId: string,
) => {
  return axios.put(
    `${API_GATEWAY_URL}/construction/units/${id}`,
    { name, communeId },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteNeighborhoodUnits = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/construction/units/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
