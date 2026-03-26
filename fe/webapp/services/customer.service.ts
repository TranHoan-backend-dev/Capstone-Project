import { CreateCustomerPayload, CustomerResponse } from "@/types";
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
