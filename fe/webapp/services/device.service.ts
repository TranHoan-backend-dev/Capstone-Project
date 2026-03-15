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

export const getAllMaterials = async (
  token: string,
  page: number,
  size: number,
  jobContent: string,
  laborCode: string,
  groupId: string,
  minPrice: string,
  maxPrice: string,
) => {
  return axios.get(`${API_GATEWAY_URL}/d/materials`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      size,
      jobContent: jobContent ?? "",
      laborCode: laborCode ?? "",
      groupId: groupId ?? "",
      minPrice: minPrice ?? "",
      maxPrice: maxPrice ?? "",
    },
  });
};

export const createMaterial = (
  accessToken: string,
  name: string,
  type: string,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/d/materials`,
    { name, type },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const updateMaterial = (
  accessToken: string,
  id: string,
  name: string,
  type: string,
) => {
  return axios.put(
    `${API_GATEWAY_URL}/d/materials/${id}`,
    { name, type },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteMaterial = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/d/materials/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
