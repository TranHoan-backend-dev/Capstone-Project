import {
  ApproveInstallationPayload,
  NewInstallationFormPayload,
} from "@/types";
import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export const getAllNetworks = (
  accessToken: string,
  page?: number,
  size?: number,
  sort?: string,
  keyword?: string | null,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/networks`, {
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

export const createNetwork = (accessToken: string, name: string) => {
  return axios.post(
    `${API_GATEWAY_URL}/construction/networks`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const updateNetwork = (
  accessToken: string,
  id: string,
  name: string,
) => {
  return axios.put(
    `${API_GATEWAY_URL}/construction/networks/${id}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteNetwork = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/construction/networks/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getAllLaterals = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  keyword?: string | null,
  networkId?: string | null,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/laterals`, {
    params: {
      page,
      size,
      sort,
      keyword,
      networkId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createLateral = (
  accessToken: string,
  name: string,
  networkId: string,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/construction/laterals`,
    { name, networkId },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const updateLateral = (
  accessToken: string,
  id: string,
  name: string,
  networkId: string,
) => {
  return axios.put(
    `${API_GATEWAY_URL}/construction/laterals/${id}`,
    { name, networkId },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteLateral = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/construction/laterals/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getAllRoadmaps = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  networkId?: string,
  lateralId?: string,
  keyword?: string | null,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/roadmaps`, {
    params: {
      page,
      size,
      sort,
      networkId,
      lateralId,
      keyword,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createRoadmap = (
  accessToken: string,
  name: string,
  networkId: string,
  lateralId: string,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/construction/roadmaps`,
    { name, networkId, lateralId },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const updateRoadmap = (
  accessToken: string,
  id: string,
  name: string,
  networkId: string,
  lateralId: string,
) => {
  return axios.put(
    `${API_GATEWAY_URL}/construction/roadmaps/${id}`,
    { name, networkId, lateralId },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteRoadmap = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/construction/roadmaps/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getAllCommunes = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  search?: string | null,
  type?: string | null,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/communes`, {
    params: {
      page,
      size,
      sort,
      search,
      type,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createCommune = (
  accessToken: string,
  name: string,
  type: string,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/construction/communes`,
    { name, type },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const updateCommune = (
  accessToken: string,
  id: string,
  name: string,
  type: string,
) => {
  return axios.put(
    `${API_GATEWAY_URL}/construction/communes/${id}`,
    { name, type },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteCommune = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/construction/communes/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getAllHamlets = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  keyword?: string | null,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/hamlets`, {
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

export const createHamlet = (
  accessToken: string,
  name: string,
  type: string,
  communeId: string,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/construction/hamlets`,
    { name, type, communeId },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const updateHamlet = (
  accessToken: string,
  id: string,
  name: string,
  type: string,
  communeId: string,
) => {
  return axios.put(
    `${API_GATEWAY_URL}/construction/hamlets/${id}`,
    { name, type, communeId },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteHamlet = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/construction/hamlets/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getAllRoads = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  keyword?: string | null,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/roads`, {
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

export const createRoad = (accessToken: string, name: string) => {
  return axios.post(
    `${API_GATEWAY_URL}/construction/roads`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const updateRoad = (accessToken: string, id: string, name: string) => {
  return axios.put(
    `${API_GATEWAY_URL}/construction/roads/${id}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteRoad = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/construction/roads/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getInstallationForms = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  keyword?: string | null,
  from?: string | null,
  to?: string | null,
) => {
  return axios.get(`${API_GATEWAY_URL}/construction/installation-forms`, {
    params: {
      page,
      size,
      sort,
      keyword,
      from,
      to,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const createNewInstallationForm = (
  accessToken: string,
  payload: NewInstallationFormPayload,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/construction/installation-forms`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const approveInstallationForm = async (
  accessToken: string,
  payload: ApproveInstallationPayload,
) => {
  try {
    const res = await axios.patch(
      `${API_GATEWAY_URL}/construction/installation-forms/approve`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return res.data;
  } catch (error: any) {
    console.error("Backend error:", error.response?.data);
    throw error;
  }
};
