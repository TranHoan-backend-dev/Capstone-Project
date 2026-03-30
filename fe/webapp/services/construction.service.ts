import {
  ApiResponse,
  ApproveInstallationPayload,
  NewInstallationFormPayload,
  ReceiptRequest,
  SettlementItem,
} from "@/types";
import {
  SettlementDetail,
  SettlementFilterRequest,
  SettlementRequest,
} from "@/types/construction/settlement.type";
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
  keyword?: string | null,
  communeId?: string | null,
  type?: string,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/hamlets`, {
    params: {
      page,
      size,
      keyword,
      communeId,
      type,
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

export const getAllNeighborhoodUnits = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  keyword?: string | null,
  communeId?: string | null,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/units`, {
    params: {
      page,
      size,
      sort,
      keyword,
      communeId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createNeighborhoodUnits = (
  accessToken: string,
  name: string,
  communeId: string,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/construction/units`,
    { name, communeId },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const updateNeighborhoodUnits = (
  accessToken: string,
  id: string,
  name: string,
  communeId: string,
) => {
  return axios.put(
    `${API_GATEWAY_URL}/construction/units/${id}`,
    { name, communeId },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteNeighborhoodUnits = (accessToken: string, id: string) => {
  return axios.delete(`${API_GATEWAY_URL}/construction/units/${id}`, {
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
};

export const assignInstallationForm = async (
  accessToken: string,
  empId: string,
  formCode: string,
  formNumber: string,
) => {
  const res = await axios.patch(
    `${API_GATEWAY_URL}/construction/installation-forms/assign/${empId}`,
    { formCode, formNumber },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  return res.data;
};

export const getPendingRegistrationForms = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
) => {
  return axios.get(
    `${API_GATEWAY_URL}/construction/installation-forms/registration/pending`,
    {
      params: { page, size, sort },
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
};

export const getPendingEstimateForms = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
) => {
  return axios.get(
    `${API_GATEWAY_URL}/construction/installation-forms/estimate/pending`,
    {
      params: { page, size, sort },
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
};

export const getReviewedEstimateForms = (accessToken: string) => {
  return axios.get(
    `${API_GATEWAY_URL}/construction/installation-forms/reviewed`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
};

export const getAssignedForms = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
) => {
  return axios.get(
    `${API_GATEWAY_URL}/construction/installation-forms/assigned`,
    {
      params: { page, size, sort },
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
};

export const getAllSettlements = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/settlements`, {
    params: {
      page,
      size,
      sort,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const filterSettlements = async (
  accessToken: string,
  filterRequest: any,
  page: number,
  size: number,
  sort: string,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/settlements/filter`, {
    params: {
      ...filterRequest,
      page,
      size,
      sort,
      status: filterRequest.status?.[0],
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getSettlementById = async (
  accessToken: string,
  settlementId: string,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/settlements/${settlementId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createSettlement = (
  accessToken: string,
  request: SettlementRequest,
) => {
  return axios.post(`${API_GATEWAY_URL}/construction/settlements`, request, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const updateSettlement = (
  accessToken: string,
  settlementId: string,
  request: SettlementRequest,
) => {
  return axios.put(
    `${API_GATEWAY_URL}/construction/settlements/${settlementId}`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const deleteSettlement = (accessToken: string, settlementId: string) => {
  return axios.delete(
    `${API_GATEWAY_URL}/construction/settlements/${settlementId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const getAllReceipts = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  keyword?: string,
  from?: string,
  to?: string,
  isPaid?: string,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/receipts`, {
    params: {
      page,
      size,
      sort,
      keyword,
      from,
      to,
      isPaid,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createReceipt = (accessToken: string, request: ReceiptRequest) => {
  return axios.post(`${API_GATEWAY_URL}/construction/receipts`, request, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const updateReceipt = (accessToken: string, request: ReceiptRequest) => {
  return axios.put(`${API_GATEWAY_URL}/construction/receipts`, request, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const deleteReceipt = (
  accessToken: string,
  formCode: string,
  formNumber: string,
) => {
  return axios.delete(
    `${API_GATEWAY_URL}/construction/receipts/${formCode}/${formNumber}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const getDetailReceipt = (
  accessToken: string,
  formCode: string,
  formNumber: string,
) => {
  return axios.get(
    `${API_GATEWAY_URL}/construction/receipts/${formCode}/${formNumber}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const getAllConstruction = (
  accessToken: string,
  page: number,
  size: number,
  // sort: string,
  keyword?: string | null,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/construction`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createAndAssignToConstructionCaptain = (
  accessToken: string,
  id: string,
  formCode: string,
  formNumber: string,
  contractId: string,
) =>
  axios.patch(
    `${API_GATEWAY_URL}/construction/construction/${id}`,
    { formCode, formNumber, contractId },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
