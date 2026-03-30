export interface PendingConstructionItem {
  stt: number;
  id: string;
  contractId: string;
  formCode: string;
  formNumber: string;
  createdAt: string;
  isApproved: string;
}

export interface PendingConstructionResponse {
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
