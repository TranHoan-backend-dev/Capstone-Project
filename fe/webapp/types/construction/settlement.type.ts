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
  connectionFee: string | number;
  address: string;
  registrationAt: string;
  status: SettlementStatus;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type SettlementNumberish = string | number | null | undefined;

export interface SettlementBaseMaterial {
  materialCode: string;
  jobContent: string;
  unit: string;
  mass: SettlementNumberish;
  materialCost: SettlementNumberish;
  laborPrice: SettlementNumberish;
  laborPriceAtRuralCommune: SettlementNumberish;
  totalLaborPrice: SettlementNumberish;
  totalMaterialPrice: SettlementNumberish;
  note?: string;
  // một số backend có thể trả thêm field tương tự
  [key: string]: any;
}

export interface SettlementDetail {
  settlementId: string;
  formCode: string;
  formNumber: string;
  jobContent: string;
  address: string;
  registrationAt: string;
  connectionFee: SettlementNumberish;
  note: string;
  createdAt?: string;
  updatedAt?: string;
  significance?: {
    surveyStaff: any;
    ptHead: any;
    president: any;
    constructionPresident?: any;
    [key: string]: any;
  };
  baseMaterials?: SettlementBaseMaterial[];
  totalMaterialPrice?: SettlementNumberish;
  totalLaborPrice?: SettlementNumberish;
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
  status?: string[];
}

export interface SettlementResponse {
  settlementId: string;
  id?: string;
  jobContent: string;
  formNumber: string;
  address: string;
  connectionFee?: SettlementNumberish;
  createdAt?: string;
  formCode: string;
  note?: string;
  registrationAt: string;
  // status: string[];
  significance?: any;
  status?: SettlementStatus | any;
  updatedAt?: string;
  baseMaterials?: SettlementBaseMaterial[];
}
