export interface SettlementItem {
  stt: string;
  id: string;
  jobContent: string;
  connectionFee: string;
  address: string;
  registrationAt: string;
  status: "PROCESSING" | "PENDING_FOR_APPROVAL" | "APPROVED" | "REJECTED";
  note?: string;
  createdAt?: string;
  updatedAt?: string;
  formCode: string;
  formNumber: string;
}

export interface SettlementDetail extends SettlementItem {
  creator: string;
  createDate: string;
  approver: string;
  approveDate: string;
  totalPrice: string;
  totalPriceNumber?: number;
  note: string;
  materials?: SettlementMaterial[];
  laborCosts?: SettlementLaborCost[];
  connectionFees?: SettlementConnectionFee[];
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
  constructionId?: string;
  customerName: string;
  phone: string;
  address: string;
  registerDate: string;
  note?: string;
  materials?: Omit<SettlementMaterial, "id">[];
  laborCosts?: Omit<SettlementLaborCost, "id">[];
  connectionFees?: Omit<SettlementConnectionFee, "id">[];
}

export interface SettlementResponse {
  address: string;
  connectionFee: number;
  createdAt: string;
  jobContent: string;
  note: string;
  registrationAt: string;
  settlementId: string;
  status: string;
  updatedAt: string;
  formCode: string;
  formNumber: string;
}
