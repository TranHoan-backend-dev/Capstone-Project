export interface EstimateItem {
  id: string;
  formCode: string;
  formNumber: string;

  customerName: string;
  address: string;

  registerDate: string;
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

  designImage: string;
  note: string;

  createdAt: string;
  updatedAt: string;
  registrationAt: string;

  createBy: string;

  installationFormId: {
    formCode: string;
    formNumber: string;
  };
}

export interface UpdateEstimateRequest {
  customerName?: string;
  address?: string;
  note?: string;
  contractFee?: number;
  surveyFee?: number;
  surveyEffort?: number;
  installationFee?: number;
  laborCoefficient?: number;
  generalCostCoefficient?: number;
  precalculatedTaxCoefficient?: number;
  constructionMachineryCoefficient?: number;
  vatCoefficient?: number;
  designCoefficient?: number;
  designFee?: number;
  waterMeterSerial?: string;
  overallWaterMeterId?: string;
  designImage?: string;
  isFinished?: boolean;
}
