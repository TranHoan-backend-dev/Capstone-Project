export type WaterMeterType = "MECHANICAL" | "ELECTRONIC" | "SMART";
export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "QR_CODE";

export interface CreateCustomerPayload {
  name: string;
  email: string;
  phoneNumber: string;
  type: string;
  isBigCustomer: boolean;
  usageTarget: string;
  numberOfHouseholds: number;
  householdRegistrationNumber: number;
  protectEnvironmentFee: number;
  waterMeterType: string;
  citizenIdentificationNumber: string;
  citizenIdentificationProvideAt: string;
  paymentMethod: string;
  bankAccountNumber: string;
  bankAccountProviderLocation: string;
  bankAccountName: string;
  isActive: boolean;

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
}

export interface CustomerResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}
