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

export const getBusinessPageNamesOfEmployees = (
  accessToken: string,
  empId: string,
) =>
  axios.get(`${API_GATEWAY_URL}/auth/authorization/${empId}/pages`, {
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
  axios.get(`${API_GATEWAY_URL}/auth/authorization/employees/construction-head`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
