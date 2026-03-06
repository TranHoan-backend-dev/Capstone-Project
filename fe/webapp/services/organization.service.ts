import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export const getAllDepartments = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  keyword?: string | null,
) =>
  axios.get(`${API_GATEWAY_URL}/org/departments`, {
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

export const createDepartment = (
  accessToken: string,
  name: string,
  phoneNumber: string,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/org/departments`,
    { name, phoneNumber },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const updateDepartment = (
  accessToken: string,
  id: string,
  name: string,
  phoneNumber: string,
) => {
  return axios.put(
    `${API_GATEWAY_URL}/org/departments/${id}`,
    { name, phoneNumber },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteDepartment = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/org/departments/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
