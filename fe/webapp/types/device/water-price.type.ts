export interface WaterPriceItem {
  id: string;
  stt: string;
  usageTarget: string;
  tax: number;
  environmentPrice: number;
  description: string;
  applicationPeriod: string;
  expirationDate: string;
}

export interface WaterPriceFilter {
  usageTarget?: string;
  tax?: number;
  environmentPrice?: number;
  description?: string;
  applicationPeriod?: string;
  expirationDate?: string;
}

export interface WaterPriceFormProps {
  initialData?: {
    id?: string;
    usageTarget?: string;
    tax?: string;
    environmentPrice?: string;
    description?: string;
    applicationPeriod?: string;
    expirationDate?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface FilterSectionWaterPriceProps {
  filter: WaterPriceFilter;
  onSearch: (value: WaterPriceFilter) => void;
  onAddNew: () => void;
}

export interface WaterPriceTableProps {
  filter: WaterPriceFilter;
  reloadKey: number;
  onEdit: (item: WaterPriceItem) => void;
  onDeleted: () => void;
}

export interface WaterPriceResponse {
  id: string;
  usageTarget: string;
  tax: number;
  environmentPrice: number;
  description: string;
  applicationPeriod: string;
  expirationDate: string;
}

export const USAGE_TARGET_LABEL: Record<string, string> = {
  DOMESTIC: "Sinh hoạt",
  INSTITUTIONAL: "Cơ quan / Hành chính sự nghiệp",
  INDUSTRIAL: "Sản xuất",
  COMMERCIAL: "Kinh doanh dịch vụ",
};