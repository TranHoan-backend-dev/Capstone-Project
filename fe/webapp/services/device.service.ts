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

export const createUnit = (accessToken: string, name: string) => {
  return axios.post(
    `${API_GATEWAY_URL}/d/units`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const updateUnit = (accessToken: string, id: string, name: string) => {
  return axios.put(
    `${API_GATEWAY_URL}/d/units/${id}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteUnit = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/d/units/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getAllWaterPrices = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  filter?: string | null,
) =>
  axios.get(`${API_GATEWAY_URL}/d/water-prices`, {
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

export const createWaterPrice = (accessToken: string, data: any) => {
  return axios.post(`${API_GATEWAY_URL}/d/water-prices`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const updateWaterPrice = (
  accessToken: string,
  id: string,
  data: any,
) => {
  return axios.put(`${API_GATEWAY_URL}/d/water-prices/${id}`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const deleteWaterPrice = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/d/water-prices/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
