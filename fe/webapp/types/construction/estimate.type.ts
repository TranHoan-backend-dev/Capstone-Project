export interface EstimateItem {
  id: string;
  formCode: string;
  formNumber: string;

  customerName: string;
  address: string;

  registerDate: string;

  status: "pending_estimate" | "processing" | "approved" | "rejected";
}

export interface EstimateResponse {
  estimationId: string;

  formCode: string;
  formNumber: string;

  customerName: string;
  address: string;

  overallWaterMeterId: string;
  waterMeterSerial: string;

  contractFee: number;
  designFee: number;
  installationFee: number;
  surveyFee: number;

  constructionMachineryCoefficient: number;
  designCoefficient: number;
  laborCoefficient: number;
  generalCostCoefficient: number;
  precalculatedTaxCoefficient: number;
  vatCoefficient: number;

  surveyEffort: number;

  designImageUrl: string;
  note: string;

  createdAt: string;
  updatedAt: string;
  registrationAt: string;

  createBy: string;

  installationFormId: {
    formCode: string;
    formNumber: string;
    status: string;
    phoneNumber: string;
  };
}
