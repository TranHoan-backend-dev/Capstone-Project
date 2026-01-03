import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface EstimateItem {
  id: number;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  registerDate: string;
  status: "pending_estimate" | "rejected";
}

export interface SettlementItem {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  registerDate: string;
  status: "approved_budget" | "rejected_budget";
}

export type DesignProcessingStatus =
  | "paid"
  | "processing"
  | "pending_restore"
  | "rejected"
  | "none";

export interface DesignProcessingItem {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  registrationDate: string;
  surveyAppointment: string;
  status: DesignProcessingStatus;
}

export interface SettlementDocumentRow {
  id: string;
  stt: number;
  code: string;
  name: string;
  unit: string;
  quantity: string;
  priceVL: string;
  priceNC: string;
  totalVL: string;
  totalNC: string;
}

export interface StatusDetailData {
  code: string;
  address: string;
  registerDate: string;
  status: string;
  creator: string | null;
  createDate: string | null;
  approver: string | null;
  approveDate: string | null;
  totalPrice: string | null;
  note: string | null;
}

export interface SurveyAssignmentItem {
  id: number;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  registrationDate: string;
  surveyDate: string;
  surveyorId?: string;
  surveyorName?: string;
  status: "pending" | "assigned";
}

export type FieldType = "input" | "date" | "select" | "search-input";

interface BaseField {
  key: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
}

export interface InputField extends BaseField {
  type: "input";
  defaultValue?: string;
}

export interface DateField extends BaseField {
  type: "date";
}

export interface SelectField extends BaseField {
  type: "select";
  defaultValue?: string;
  options: { key: string; label: string }[];
}

export interface SearchInputField extends BaseField {
  type: "search-input";
  onSearchClick?: () => void;
  defaultValue?: string;
}

export type FormField = InputField | DateField | SelectField | SearchInputField;

export type OrderStage = "register" | "estimate" | "contract" | "construction";

export type OrderStatus = "processing" | "pending" | "approved" | "rejected";
