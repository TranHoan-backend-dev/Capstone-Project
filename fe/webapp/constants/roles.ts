export const ROLES = {
  IT_STAFF: "it_staff",
  PLANNING_TECHNICAL_DEPARTMENT_HEAD: "planning_technical_department_head",
  SURVEY_STAFF: "survey_staff",
  ORDER_RECEIVING_STAFF: "order_receiving_staff",
  FINANCE_DEPARTMENT: "finance_department",
  CONSTRUCTION_DEPARTMENT_HEAD: "construction_department_head",
  CONSTRUCTION_DEPARTMENT_STAFF: "construction_department_staff",
  BUSINESS_DEPARTMENT_HEAD: "business_department_head",
  METER_INSPECTION_STAFF: "meter_inspection_staff",
  COMPANY_LEADERSHIP: "company_leadership",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
