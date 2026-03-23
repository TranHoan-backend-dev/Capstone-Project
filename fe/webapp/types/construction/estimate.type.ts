export interface EstimateItem {
  id: string;
  formCode: string;
  formNumber: string;
  note: string;
  customerName: string;
  address: string;
  registerDate: string;
}

export interface MaterialEstimateItem {
  id: string;

  code: string;
  description: string;
  unit: string;

  quantity: number;
  reductionFactor: number;

  materialPrice: number;
  laborPrice: number;

  materialTotal: number;
  laborTotal: number;

  note: string;
  stt: number;
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

export type UpdateEstimatePayload = {
  generalInformation: {
    estimationId: string;
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
  };
  material: {
    materialCode: string;
    jobContent: string;
    note?: string;
    unit: string;
    reductionCoefficient: string;
    mass: string;
    materialCost: string;
    laborPrice: string;
  }[];
  isFinished: boolean;
};

export interface EstimateGeneralInformation {
  estimationId: string;
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
  designImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  registrationAt?: string;
  createBy?: string;
  waterMeterSerial?: string;
  overallWaterMeterId?: string;
  installationFormId?: {
    formCode: string;
    formNumber: string;
  };
}

export interface MaterialItem {
  materialCode: string;
  jobContent: string;
  note: string;
  unit: string;
  reductionCoefficient: string;
  mass: string;
  materialCost: string;
  laborPrice: string;
  laborPriceAtRuralCommune?: string;
  totalMaterialPrice: string;
  totalLaborPrice: string;
}

export interface EstimateResponse {
  generalInformation: EstimateGeneralInformation;
  material: MaterialItem[];
}

export interface MaterialEstimateItem {
  id: string;
  code: string;
  description: string;
  unit: string;
  quantity: number;
  reductionFactor: number;
  materialPrice: number;
  laborPrice: number;
  materialTotal: number;
  laborTotal: number;
  note: string;
  stt: number;
}

export interface UpdateEstimateRequest {
  generalInformation: {
    estimationId: string;
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
    designImage?: string; // URL sau khi upload
    waterMeterSerial?: string;
    overallWaterMeterId?: string;
    designImageUrl?: string;
  };
  material?: Array<{
    materialCode: string;
    jobContent: string;
    note?: string;
    unit: string;
    reductionCoefficient: string;
    mass: string;
    materialCost: string;
    laborPrice: string;
  }>;
}
