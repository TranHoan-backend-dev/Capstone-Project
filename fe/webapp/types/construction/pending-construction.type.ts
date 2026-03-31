// Update your types file
export interface PendingConstructionItem {
  stt: number;
  id: string;
  contractId: string;
  formCode: string;
  formNumber: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  constructedByFullName: string;
  createdAt: string;
  registrationAt: string;
  scheduleSurveyAt: string;
  isApproved: string;
  status: string;
}

export interface PendingConstructionResponse {
  id: string;
  contractId: string;
  formCode: string;
  formNumber: string;
  customerName: string;
  address: string;
  phoneNumber: string;
  scheduleSurveyAt: string;
  registrationAt: string;
  handoverBy: string | null;
  handoverByFullName: string;
  creator: string;
  creatorFullName: string;
  constructedBy: string | null;
  constructedByFullName: string;
  status: {
    registration: string;
    estimate: string;
    contract: string;
    construction: string;
  };
  overallWaterMeterId: string;
  isApproved: string;
  createdAt: string;
}

export interface FilterPendingConstructionRequest {
  keyword?: string;
  fromDate?: string;
  toDate?: string;
  approvalDate?: string;
  teamLeader?: string;
  constructionUnit?: string;
  content?: string;
}

export interface AssignRequest {
  contractId: string;
  formCode: string;
  formNumber: string;
}

export interface PendingTableProps {
  filters?: FilterPendingConstructionRequest;
  refreshTrigger?: number;
  onSuccess?: () => void;
}

export interface BackendConstructionData {
  id: string;
  contractId: string;
  createdAt: string;
  isApproved: string;
  installationForm?: {
    constructionRequestId: string | null;
    formCode: string;
    formNumber: string;
    address: string;
    customerName: string;
    phoneNumber: string;
    constructedBy: string | null;
    constructedByFullName: string;
    creator: string;
    creatorFullName: string;
    handoverBy: string | null;
    handoverByFullName: string;
    registrationAt: string;
    scheduleSurveyAt: string;
    overallWaterMeterId: string;
    status: {
      registration: string;
      estimate: string;
      contract: string;
      construction: string;
    };
  };
}