import {
  DarkBlueChip,
  DarkGreenChip,
  DarkRedChip,
  DarkYellowChip,
} from "@/config/chip-and-icon";

export type WaterMeterType = "MECHANICAL" | "ELECTRONIC" | "SMART";
export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "QR_CODE";
export const usageTargetMap: Record<string, string> = {
  DOMESTIC: "Sinh hoạt",
  INSTITUTIONAL: "Cơ quan, hành chính sự nghiệp",
  INDUSTRIAL: "Sản xuất",
  COMMERCIAL: "Kinh doanh dịch vụ",
};

export const statusCustomerConfig: Record<string, { className: string }> = {
  "Bình thường": {
    className: `bg-green-100 text-green-700 ${DarkGreenChip}`,
  },
  "Chờ duyệt": {
    className: `bg-blue-100 text-blue-700 ${DarkBlueChip}`,
  },
  "Tạm ngưng": {
    className: `bg-amber-100 text-amber-700 ${DarkYellowChip}`,
  },
  "Đã khóa": {
    className: `bg-red-100 text-red-700 ${DarkRedChip}`,
  },
};
export type CustomerType = "FAMILY" | "COMPANY";
export const typeLabelMap: Record<string, string> = {
  FAMILY: "Hộ gia đình",
  COMPANY: "Công ty",
  GOVERNMENT: "Cơ quan hành chính",
  PRODUCTION: "Sản xuất",
  BUSINESS: "Kinh doanh dịch vụ",
};
// types.ts
// types.ts
export interface CustomerFilter {
  name?: string;
  phoneNumber?: string;
  citizenIdentificationNumber?: string;
  address?: string;
  type?: string;
  usageTarget?: string;
  roadmapId?: string;
  formNumber?: string;
}

export interface CustomerLookupTableProps {
  keyword: CustomerFilter;
  reloadKey: number;
  // onEdit: (item: CustomerFilter) => void;
  onDeleted: () => void;
}

export interface CustomerLookupItem {
  stt: string;
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  customerId?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankAccountProviderLocation?: string;
  budgetRelationshipCode?: string;
  cancelReason?: string | null;
  citizenIdentificationNumber?: string;
  citizenIdentificationProvideAt?: string;
  connectionPoint?: string;
  createdAt?: string;
  deductionPeriod?: string;
  fixRate?: string;
  householdRegistrationNumber?: number;
  installationFee?: number;
  installationFormId?: string;
  isActive?: boolean;
  status?: boolean;
  isBigCustomer?: boolean;
  isFree?: boolean;
  isSale?: boolean;
  m3Sale?: string;
  monthlyRent?: number;
  numberOfHouseholds?: number;
  passportCode?: string;
  paymentMethod?: string;
  protectEnvironmentFee?: number;
  type?: string;
  updatedAt?: string;
  usageTarget?: string;
  waterMeterId?: string;
  waterMeterType?: string;
  waterPrice?: WaterPrice;
  roadmapId?: string;
}

export interface CustomerLookupResponse {
  name: string;
  email: string;
  phoneNumber: string;
  customerId?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankAccountProviderLocation?: string;
  budgetRelationshipCode?: string;
  cancelReason?: string | null;
  citizenIdentificationNumber?: string;
  citizenIdentificationProvideAt?: string;
  connectionPoint?: string;
  createdAt?: string;
  deductionPeriod?: string;
  fixRate?: string;
  householdRegistrationNumber?: number;
  installationFee?: number;
  installationFormId?: string;
  isActive?: boolean;
  isBigCustomer?: boolean;
  isFree?: boolean;
  isSale?: boolean;
  m3Sale?: string;
  monthlyRent?: number;
  numberOfHouseholds?: number;
  passportCode?: string;
  paymentMethod?: string;
  protectEnvironmentFee?: number;
  type?: CustomerType;
  updatedAt?: string;
  usageTarget?: string;
  waterMeterId?: string;
  waterMeterType?: string;
  waterPrice?: WaterPrice;
  roadmapId?: string;
}

export interface WaterPrice {
  id: string;
  usageTarget: string;
  tax: number;
  applicationPeriod?: string;
  createdAt?: string;
  description?: string;
  environmentPrice?: number;
  expirationDate?: string;
  updatedAt?: string;
  waterPriceId?: string;
}

export interface CreateCustomerPayload {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  type: string;
  isBigCustomer: boolean;
  usageTarget: string;
  numberOfHouseholds: number;
  householdRegistrationNumber: number;
  protectEnvironmentFee: number;
  waterMeterType: string;
  citizenIdentificationNumber: string;
  // citizenIdentificationProvideAt: string;
  paymentMethod: string;
  bankAccountNumber: string;
  bankAccountProviderLocation: string;
  bankAccountName: string;
  isActive: boolean;
  taxCode: string;
  citizenIdentificationProvideAt: string;
  formNumber: string;
  formCode: string;
  waterPriceId: string;
  waterMeterId: string;
  isFree: boolean;
  isSale: boolean;
  m3Sale: string;
  fixRate: string;
  installationFee: number;
  deductionPeriod: string;
  monthlyRent: number;
  budgetRelationshipCode: string;
  passportCode: string;
  connectionPoint: string;
  roadmapId: string;
}

export interface CustomerResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface CustomerRegistrationProps {
  initialData?: any;
  onSuccess?: () => void;
}

export interface TechnicalInfoProps {
  formData: CreateCustomerPayload;
  onUpdate: (field: keyof CreateCustomerPayload, value: any) => void;
}

export interface BillingInfoProps {
  formData: CreateCustomerPayload;
  onUpdate: (field: keyof CreateCustomerPayload, value: any) => void;
}

export interface CustomerInfoProps {
  formData: CreateCustomerPayload;
  onUpdate: (field: keyof CreateCustomerPayload, value: any) => void;
}
