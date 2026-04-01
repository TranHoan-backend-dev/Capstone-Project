export interface SettlementStatus {
  registration: string;
  estimate: string;
  contract: string;
  construction: string;
}

export interface SettlementItem {
  stt: string;
  id: string;
  formCode: string;
  formNumber: string;
  jobContent: string;
  connectionFee: string;
  address: string;
  registrationAt: string;
  status: SettlementStatus;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SettlementDetail {
  settlementId: string;
  formCode: string;
  formNumber: string;
  jobContent: string;
  address: string;
  registrationAt: string;
  connectionFee: number;
  note: string;
  createdAt: string;
  updatedAt: string;
  significance: {
    surveyStaff: string;
    ptHead: string;
    president: string;
    constructionPresident: string;
  };
  status: {
    registration: string;
    estimate: string;
    contract: string;
    construction: string;
  };
}

export interface SettlementMaterial {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type SettlementFilter = {
  keyword?: string;
  from?: string;
  to?: string;
  status?: string;
};

export interface SettlementTableProps {
  keyword: SettlementFilter;
  reloadKey: number;
  onEdit: (item: SettlementItem) => void;
  onDeleted: () => void;
}

export interface SettlementLaborCost {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SettlementConnectionFee {
  id: string;
  feeType: string;
  amount: number;
}

export interface SettlementFilterRequest {
  keyword?: string;
  fromDate?: string;
  toDate?: string;
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface SettlementRequest {
  formCode: string;
  formNumber: string;
  jobContent: string;
  address: string;
  connectionFee: number;
  note?: string;
  registrationAt: string;
  status: string[];
}

export interface SettlementResponse {
  settlementId: string;
  jobContent: string;
  formNumber: string;
  address: string;
  connectionFee: number;
  createdAt: string;
  formCode: string;
  note: string;
  registrationAt: string;
  // status: string[];
  significance: any;
  status: SettlementStatus;
  updatedAt: string;
}
