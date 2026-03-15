export interface EstimateItem {
  id: number;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  registerDate: string;
  status: "pending_estimate" | "rejected";
}

export interface EstimateResponse{
  id: string;
  stt: string;
  name: string;
}
