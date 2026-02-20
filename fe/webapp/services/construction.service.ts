import { API_GATEWAY_URL } from "@/utils/constraints";
import axios from "axios";

export const getAllRoadmaps = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  keyword?: string | null,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/roadmaps`, {
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

export const createRoadmap = (
  accessToken: string,
  name: string,
  type: string,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/construction/roadmaps`,
    { name, type },
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
) => {
  return axios.put(
    `${API_GATEWAY_URL}/construction/roadmaps/${id}`,
    { name },
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