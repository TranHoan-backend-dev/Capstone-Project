export const ROLES = {
  IT_STAFF: "it_staff",
  PLANNING_TECH_STAFF: "planning_technical_department_staff",
  PLANNING_TECH_HEAD: "planning_technical_department_head",
  CONSTRUCTION_STAFF: "construction_department_staff",
  CONSTRUCTION_HEAD: "construction_department_head",
  SALES_STAFF: "sales_department_staff",
  SALES_HEAD: "sales_department_head",
  FINANCE: "finance_department",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
