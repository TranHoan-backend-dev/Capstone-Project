export const getRoleBasedRoute = (role: string): string => {
  const roleRouteMap: Record<string, string> = {
    IT_STAFF: "/statistics",
    ORDER_RECEIVING_STAFF: "/installation-form/lookup",
    SURVEY_STAFF: "/design-processing",
    PLANNING_TECHNICAL_DEPARTMENT_HEAD: "/assigning-survey",
    COMPANY_LEADERSHIP: "/statistics",
    CONSTRUCTION_DEPARTMENT_HEAD: "/pending-construction",
    CONSTRUCTION_DEPARTMENT_STAFF: "/pending-construction",
    FINANCE_DEPARTMENT: "/installation-fee-collection",
    METER_INSPECTION_STAFF: "/home",
    BUSINESS_DEPARTMENT_HEAD: "/roadmap-assignment",
  };
  return roleRouteMap[role] || "/home";
};
