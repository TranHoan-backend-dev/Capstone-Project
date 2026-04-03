import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export const getAllEmployees = (
  accessToken: string,
  page: number,
  size: number,
  isEnabled?: boolean,
  username?: string,
) =>
  axios.get(`${API_GATEWAY_URL}/auth/authorization/employees`, {
    params: {
      page,
      size,
      isEnabled,
      username,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createEmployee = (
  accessToken: string,
  body: {
    username: string;
    email: string;
    fullName: string;
    phone: string;
    role: string;
    departmentId?: string;
    waterSupplyNetworkId?: string;
  },
) => {
  return axios.post(`${API_GATEWAY_URL}/auth/authorization/employees`, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};

export const updateEmployee = (
  accessToken: string,
  id: string,
  body: {
    name?: string;
    phone?: string;
    departmentId?: string;
    networkId?: string;
    isActive?: boolean;
  },
) => {
  return axios.put(
    `${API_GATEWAY_URL}/auth/authorization/employees/${id}`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
};

export const deleteEmployee = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/auth/authorization/employees/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getBusinessPageNamesOfEmployees = (
  accessToken: string,
  empId: string,
) =>
  axios.get(`${API_GATEWAY_URL}/auth/authorization/employees/${empId}/pages`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getSurveyStaff = (accessToken: string) =>
  axios.get(`${API_GATEWAY_URL}/auth/authorization/employees/survey-staff`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getEmployeeById = (accessToken: string, id: string) =>
  axios.get(`${API_GATEWAY_URL}/auth/authorization/employees/${id}/name`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getPlanningHead = (accessToken: string) =>
  axios.get(`${API_GATEWAY_URL}/auth/authorization/employees/pt-head`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getCompanyLeadership = (accessToken: string) =>
  axios.get(`${API_GATEWAY_URL}/auth/authorization/employees/leadership`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getConstructionHead = (accessToken: string) =>
  axios.get(
    `${API_GATEWAY_URL}/auth/authorization/employees/construction-head`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

export const getConstructionStaff = (accessToken: string) =>
  axios.get(
    `${API_GATEWAY_URL}/auth/authorization/employees/construction-staff`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
