export interface FeeCollectionItem {
  id: string;
  formCode: string;
  formNumber: string;
  stt: number;
  receiptNumber: string;
  customerName: string;
  address: string;
  paymentDate: string;
  isPaid: boolean;
  createdAt: string;
}
export interface FeeCollectionResponse {
  formCode: string;
  formNumber: string;
  receiptNumber: string;
  customerName: string;
  address: string;
  paymentDate: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export type FeeCollectionFilter = {
  name?: string;
  fromDate?: string;
  toDate?: string;
  isPaid?: boolean;
};

export interface FilterSectionFeeCollectionProps {
  keyword: FeeCollectionFilter;
  onSearch: (value: FeeCollectionFilter) => void;
  onAddNew: () => void;
}

export interface FeeCollectionFormProps {
  initialData?: {
    formCode?: string;
    formNumber?: string;
    receiptNumber?: string;
    customerName?: string;
    address?: string;
    paymentDate?: string;
    isPaid?: boolean;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface FeeTableTableProps {
  filter: FeeCollectionFilter;
  reloadKey: number;
  onEdit: (item: FeeCollectionItem) => void;
  onDeleted: () => void;
}

export interface ReceiptRequest {
  formCode: string;
  formNumber: string;
  receiptNumber: string;
  customerName: string;
  address: string;
  paymentDate: string;
  isPaid: boolean;
}
