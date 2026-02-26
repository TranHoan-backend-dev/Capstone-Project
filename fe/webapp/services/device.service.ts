import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

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
