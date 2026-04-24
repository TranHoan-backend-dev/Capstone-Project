export interface Representative {
  name: string;
  position: string;
}

export interface Appendix {
  content?: string;
  time?: string;
}

export interface CreateContractRequest {
  contractId: string;
  formCode: string;
  formNumber: string;
  customerId: string;
  representatives: Representative[];
  appendix: Appendix[];
}

export interface ContractResponse {
  contractId: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerId: string;
  installationFormId: string;
  representatives: Representative[];
}

export interface ContractFilterRequest {
  keyword?: string;
  contractId?: string;
  formCode?: string;
  formNumber?: string;
  customerId?: string;
  customerName?: string;
  customerPhoneNumber?: string;
  from?: string;
  to?: string;
  representatives?: Representative[];
  appendix?: Appendix[];
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
