export interface DesignProcessingItem {
  id: string;
  formNumber: string;
  customerName: string;
  address: string;
  registrationAt: string;
  phoneNumber: string;
  scheduleSurveyAt: string;
  status: DesignProcessingStatus;
}

export type DesignProcessingStatus =
  | "paid"
  | "processing"
  | "pending_restore"
  | "rejected"
  | "none";