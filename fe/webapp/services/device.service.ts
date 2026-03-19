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

export const getAllMaterials = (
  accessToken: string,
  page: number,
  size: number,
) =>
  axios.get(`${API_GATEWAY_URL}/d/materials`, {
    params: {
      page,
      size,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

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

export const getAllMaterialsGroup = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  filter?: string,
) =>
  axios.get(`${API_GATEWAY_URL}/d/materials-groups`, {
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

export const createMaterialGroup = (
  accessToken: string,
  name: string,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/d/materials/group`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const updateMaterialGroup = (
  accessToken: string,
  id: string,
  name: string,
) => {
  return axios.put(
    `${API_GATEWAY_URL}/d/materials/group/${id}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteMaterialGroup = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/d/materials/group/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getAllOverallWaterMeters = (
    accessToken: string,
    page: number,
    size: number,
    sort: string,
    keyword?: string | null,
) =>
    axios.get(`${API_GATEWAY_URL}/d/water-meters/overall`, {
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