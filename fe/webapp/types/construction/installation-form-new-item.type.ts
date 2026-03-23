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
  scheduleSurveyAt:string;
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

type FormStatus = {
  registration: string;
  estimate: string;
  contract: string;
  construction: string;
};

export interface NewInstallationLookupResponse {
  formCode: string;
  formNumber: string;
  customerName: string;
  address: string;
  registrationAt: string;
  status: FormStatus;
  phoneNumber: string;
  receivedFormAt: string;
  scheduleSurveyAt: string;
}

export type OrderStage =
  | "registration"
  | "estimate"
  | "contract"
  | "construction";

export type OrderStatus = "processing" | "pending" | "approved" | "rejected";

export type UsageTarget =
  | "DOMESTIC"
  | "COMMERCIAL"
  | "INDUSTRIAL"
  | "INSTITUTIONAL";

export type CustomerType = "FAMILY" | "COMPANY";

export interface NewInstallationFormProps {
  formData: NewInstallationFormPayload;
  updateField: (field: keyof NewInstallationFormPayload, value: any) => void;
}

export interface NewInstallationFormPayload {
  formCode: string;
  formNumber: string;
  customerName: string;
  representative: { name: string }[];
  address: string;
  citizenIdentificationNumber: string;
  citizenIdentificationProvideDate: string;
  citizenIdentificationProvideLocation: string;
  phoneNumber: string;
  taxCode: string;
  bankAccountNumber: string;
  bankAccountProviderLocation: string;
  usageTarget: UsageTarget;
  customerType: CustomerType;
  receivedFormAt: string;
  scheduleSurveyAt: string;
  numberOfHousehold?: number | "";
  householdRegistrationNumber?: number | "";
  networkId: string;
  overallWaterMeterId: string;
}

export interface ApproveInstallationPayload {
  formCode: string;
  formNumber: string;
  status: boolean;
}
