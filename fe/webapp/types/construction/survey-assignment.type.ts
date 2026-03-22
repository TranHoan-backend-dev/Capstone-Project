export interface SurveyAssignmentItem {
  stt: number;
  id: string;
  formCode: string;
  formNumber: string;
  customerName: string;
  address: string;
  phoneNumber: string;
  handoverBy: string;
  handoverByFullName: string;
  constructedBy: string;
  constructedByFullName: string;
  registrationAt: string;
  scheduleSurveyAt: string;
  creator: string;
  creatorFullName: string;
  overallWaterMeterId: string;
  status: "pending" | "assigned";
}
export interface SurveyAssignmentFormResponse {
  formCode: string;
  formNumber: string;
  customerName: string;
  address: string;
  phoneNumber: string;
  handoverBy: string;
  handoverByFullName: string;
  constructedBy: string;
  constructedByFullName: string;
  registrationAt: string;
  scheduleSurveyAt: string;
  creator: string;
  creatorFullName: string;
  overallWaterMeterId: string;
}
