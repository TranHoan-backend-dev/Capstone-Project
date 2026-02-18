export interface NewInstallationFormItem {
  id: string;
  stt: number;
  formNumber: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  registrationAt: string;
}

export interface NewInstallationFormResponse {
  formCode: string;
  formNumber: string;
  customerName: string;
  address: string;
  phoneNumber: string;
  registrationAt: string;
}

export interface NewInstallationLookupItem {
  id: string;
  stt: number;
  formNumber: string;
  customerName: string;
  address: string;
  stage: OrderStage;
  status: OrderStatus;
}

export interface NewInstallationLookupResponse {
  formCode: string;
  formNumber: string;
  customerName: string;
  address: string;
  status: string;
}

export type OrderStage = "registration" | "estimate" | "contract" | "construction";

export type OrderStatus = "processing" | "pending" | "approved" | "rejected";
