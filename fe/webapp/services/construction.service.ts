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
import { UpdateEstimateRequest } from "@/types";
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

export const getRoadmapById = (accessToken: string, id: string) => {
  return axios.get(`${API_GATEWAY_URL}/construction/roadmaps/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const assignRoadmapStaff = (
  accessToken: string,
  roadmapId: string,
  staffId: string,
) => {
  return axios.patch(
    `${API_GATEWAY_URL}/construction/roadmaps/${roadmapId}/assign/${staffId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const cancelRoadmapAssignment = (
  accessToken: string,
  roadmapId: string,
) => {
  return axios.patch(
    `${API_GATEWAY_URL}/construction/roadmaps/${roadmapId}/cancel-assignment`,
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const updateRoadmapAssignment = (
  accessToken: string,
  roadmapId: string,
  staffId: string,
) => {
  return axios.patch(
    `${API_GATEWAY_URL}/construction/roadmaps/${roadmapId}/update-assignment/${staffId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
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
  keyword?: string | null,
  from?: string | null,
  to?: string | null,
  status?: string,
) => {
  return axios.get(`${API_GATEWAY_URL}/construction/installation-forms`, {
    params: {
      page,
      size,
      keyword,
      from,
      to,
      status,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getInstallationFormById = async (
  accessToken: string,
  formId: string,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/installation-forms/${formId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getInstallationFormByCode = async (
  accessToken: string,
  formCode: string,
  formNumber: string,
) =>
  axios.get(
    `${API_GATEWAY_URL}/construction/installation-forms/details/${formCode}/${formNumber}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

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

export const getLastCode = async (accessToken: string) => {
  return axios.get(
    `${API_GATEWAY_URL}/construction/installation-forms/last-code`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const getPendingRegistrationForms = (
  accessToken: string,
  page: number,
  size: number,
  // sort: string,
) => {
  return axios.get(
    `${API_GATEWAY_URL}/construction/installation-forms/registration/pending`,
    {
      params: { page, size },
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
};

export const getPendingEstimateForms = (
  accessToken: string,
  page: number,
  size: number,
  // sort: string,
) => {
  return axios.get(
    `${API_GATEWAY_URL}/construction/installation-forms/estimate/pending`,
    {
      params: { page, size },
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
  // sort: string,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/settlements`, {
    params: {
      page,
      size,
      // sort,
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
  // sort: string,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/settlements/filter`, {
    params: {
      ...filterRequest,
      page,
      size,
      // sort,
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

export const getAllEstimates = (
  accessToken: string,
  page: number,
  size: number,
  sort: string,
  keyword?: string | null,
  from?: string,
  to?: string,
) => {
  const params: Record<string, any> = {
    page,
    size,
    sort,
  };

  if (keyword && keyword.trim() !== "") {
    params.keyword = keyword;
  }
  if (from && from.trim() !== "") {
    params.from = from;
  }
  if (to && to.trim() !== "") {
    params.to = to;
  }

  return axios.get(`${API_GATEWAY_URL}/construction/estimates`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getEstimateById = (accessToken: string, estimateId: string) =>
  axios.get(`${API_GATEWAY_URL}/construction/estimates/${estimateId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const getEstimateMeterType = (accessToken: string, formCode: string) =>
  axios.get(
    `${API_GATEWAY_URL}/construction/estimates/meter-type/${formCode}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

// export const updateEstimate = (
//   accessToken: string,
//   estimateId: string,
//   data: UpdateEstimateRequest,
// ) =>
//   axios.put(`${API_GATEWAY_URL}/construction/estimates/${estimateId}`, data, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//   });

export const updateEstimate = (
  accessToken: string,
  estimateId: string,
  data: FormData,
) =>
  axios.put(`${API_GATEWAY_URL}/construction/estimates/${estimateId}`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      // "Content-Type": "multipart/form-data; boundary=WebAppBoundary",
      // KHÔNG set Content-Type - axios sẽ tự set multipart/form-data với boundary
    },
  });

export const approveEstimate = (
  accessToken: string,
  estimateId: string,
  status: string,
) =>
  axios.patch(
    `${API_GATEWAY_URL}/construction/estimates/${estimateId}`,
    status,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

export const requestEstimateSignature = (
  accessToken: string,
  estId: string,
  surveyStaff: string,
  plHead: string,
  companyLeadership: string,
) =>
  axios.post(
    `${API_GATEWAY_URL}/construction/estimates/sign`,
    {
      estId,
      surveyStaff,
      plHead,
      companyLeadership,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

export const signEstimate = (
  accessToken: string,
  estimateId: string,
  electronicSignUrl: string,
) =>
  axios.patch(
    `${API_GATEWAY_URL}/construction/estimates/sign`,
    {
      estimateId,
      electronicSignUrl,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

export const getAllConstruction = (
  accessToken: string,
  page: number,
  size: number,
  keyword?: string | null,
  fromDate?: string,
  toDate?: string,
) =>
  axios.get(`${API_GATEWAY_URL}/construction/construction`, {
    params: {
      page,
      size,
      keyword,
      fromDate,
      toDate,
    },
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

export const updateConstructionStaff = (
  accessToken: string,
  id: string,
  empId: string,
) => {
  return axios.patch(
    `${API_GATEWAY_URL}/construction/construction/pending-requests/${id}/${empId}`, // Fixed URL
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

export const reviewConstruction = (
  accessToken: string,
  id: string,
  status: boolean,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/construction/construction/review/${id}/${status}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
};

// export const reviewConstruction = (
//   accessToken: string,
//   id: string,
//   status: string,
// ) => {
//   return axios.post(
//     `${API_GATEWAY_URL}/construction/construction/review/${id}/${status}`,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     },
//   );
// };

export const requestSignSettlement = (
  accessToken: string,
  settlementId: string,
  surveyStaff: string,
  plHead: string,
  companyLeadership: string,
  // constructionPresident: string,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/construction/settlements/sign`,
    {
      settlementId,
      surveyStaff,
      plHead,
      companyLeadership,
      // constructionPresident,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
};

export const signSettlement = (
  accessToken: string,
  setlementId: string,
  url?: string,
) => {
  return axios.post(
    `${API_GATEWAY_URL}/construction/settlements/sign/${setlementId}`,
    {
      url,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
};
