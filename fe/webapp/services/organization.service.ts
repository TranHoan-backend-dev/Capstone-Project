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

export const getAllJobs = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  name?: string | null,
  fromDate?: string,
  toDate?: string,
) =>
  axios.get(`${API_GATEWAY_URL}/org/jobs`, {
    params: {
      page,
      size,
      sort,
      name,
      fromDate,
      toDate,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createJob = (
  accessToken: string,
  name: string,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/org/jobs`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const updateJob = (
  accessToken: string,
  id: string,
  name: string,
) => {
  return axios.put(
    `${API_GATEWAY_URL}/org/jobs/${id}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteJob = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/org/jobs/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const ViewBusinessPageService = (
  accessToken: string,
  page: number,
  size: number,
  keyword?: string | null,
  isActive?: boolean | null,
) =>
  axios.get(`${API_GATEWAY_URL}/org/business-pages`, {
    params: {
      page,
      size,
      keyword,
      isActive,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createBusinessPage = (
  accessToken: string,
  name: string,
  activate: boolean,
  creator: string,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/org/business-pages`,
    { name, activate, creator },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const updateBusinessPage = (
  accessToken: string,
  id: string,
  name: string,
  activate: boolean,
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

