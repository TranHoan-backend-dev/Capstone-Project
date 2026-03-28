import { CreateCustomerPayload } from "@/types";
import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export const getAllCustomers = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  filters?: Record<string, any>,
) => {
  const params: Record<string, any> = {
    page,
    size,
    sort,
  };

  if (filters) {
    Object.keys(filters).forEach((key) => {
      params[key] = filters[key];
    });
  }

  return axios.get(`${API_GATEWAY_URL}/customer/customers`, {
    params: params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getCustomerById = (accessToken: string, customerId: string) => {
  return axios.get(`${API_GATEWAY_URL}/customer/customers/${customerId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const createCustomer = async (
  accessToken: string,
  payload: CreateCustomerPayload,
) => {
  const response = await axios.post(
    `${API_GATEWAY_URL}/customer/customers`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data;
};

export const updateCustomer = async (
  accessToken: string,
  payload: CreateCustomerPayload,
  customerId: string,
) => {
  const response = await axios.put(
    `${API_GATEWAY_URL}/customer/customers/${customerId}`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data;
};

export const deleteCustomer = (accessToken: string, customerId: string) => {
  return axios.delete(`${API_GATEWAY_URL}/customer/customers/${customerId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getAllContracts = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  filters?: Record<string, any>,
) => {
  const params: Record<string, any> = {
    page,
    size,
    sort,
  };

  if (filters) {
    Object.keys(filters).forEach((key) => {
      params[key] = filters[key];
    });
  }

  return axios.get(`${API_GATEWAY_URL}/customer/contracts`, {
    params: params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getContractById = (accessToken: string, customerId: string) => {
  return axios.get(`${API_GATEWAY_URL}/customer/contracts/${customerId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const createContract = async (accessToken: string, payload: any) => {
  const response = await axios.post(
    `${API_GATEWAY_URL}/customer/contracts`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return response.data;
};

export const deleteContract = (accessToken: string, customerId: string) => {
  return axios.delete(`${API_GATEWAY_URL}/customer/contracts/${customerId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getContractByFormCodeAndFormNumber = (
  accessToken: string,
  formCode: string,
  formNumber: string,
) => {
  console.log("Calling backend API:", `${API_GATEWAY_URL}/customer/contracts/ids`);
  console.log("Params:", { formCode, formNumber });
  console.log("Token exists:", !!accessToken);
  
  return axios.get(`${API_GATEWAY_URL}/customer/contracts/ids`, {
    params: { 
      formCode, 
      formNumber 
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
};
