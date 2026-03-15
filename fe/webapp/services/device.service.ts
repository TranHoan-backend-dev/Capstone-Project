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

export const getAllTypes = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
) =>
  axios.get(`${API_GATEWAY_URL}/d/meter-types`, {
    params: {
      page,
      size,
      sort,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createType = (
  accessToken: string,
  name: string,
  origin: string,
  meterModel: string,
  size: string,
  maxIndex: string,
  diameter: string,
  qn: string,
  qt: string,
  qmin: string,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/d/meter-types`,
    { name, origin, meterModel, size, maxIndex, diameter, qn, qt, qmin },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const updateType = (
  accessToken: string,
  id: string,
  name: string,
  origin: string,
  meterModel: string,
  size: string,
  maxIndex: string,
  diameter: string,
  qn: string,
  qt: string,
  qmin: string,
) => {
  return axios.put(
    `${API_GATEWAY_URL}/d/meter-types/${id}`,
    { name, origin, meterModel, size, maxIndex, diameter, qn, qt, qmin },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteType = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/d/meter-types/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
