import { useProfile } from "./useLogin";

export const useHasRole = (requiredRole: string) => {
  const { profile, loading } = useProfile();

  const hasRole = profile?.role === requiredRole;

  return { hasRole, loading };
};

export const useHasAnyRole = (requiredRoles: string[]) => {
  const { profile, loading } = useProfile();

  const hasRole = profile?.role ? requiredRoles.includes(profile.role) : false;

  return { hasRole, loading };
};

export const useIsITStaff = () => {
  const { hasRole, loading } = useHasRole("IT_STAFF");

  return { isITStaff: hasRole, loading };
};
export const useIsBusinessDepartmentHead = () => {
  const { hasRole, loading } = useHasRole("BUSINESS_DEPARTMENT_HEAD");
  return { isBusinessDepartmentHead: hasRole, loading };
};

export const useIsConstructionDepartmentStaff = () => {
  const { hasRole, loading } = useHasRole("CONSTRUCTION_DEPARTMENT_STAFF");
  return { isConstructionDepartmentStaff: hasRole, loading };
};

export const useIsFinanceDepartment = () => {
  const { hasRole, loading } = useHasRole("FINANCE_DEPARTMENT");
  return { isFinanceDepartment: hasRole, loading };
};

export const useIsMeterInspectionStaff = () => {
  const { hasRole, loading } = useHasRole("METER_INSPECTION_STAFF");
  return { isMeterInspectionStaff: hasRole, loading };
};

export const useIsCompanyLeadership = () => {
  const { hasRole, loading } = useHasRole("COMPANY_LEADERSHIP");
  return { isCompanyLeadership: hasRole, loading };
};

export const useIsOrderReceivingStaff = () => {
  const { hasRole, loading } = useHasRole("ORDER_RECEIVING_STAFF");
  return { isOrderReceivingStaff: hasRole, loading };
};

export const useIsPlanningTechnicalDepartmentHead = () => {
  const { hasRole, loading } = useHasRole("PLANNING_TECHNICAL_DEPARTMENT_HEAD");
  return { isPlanningTechnicalDepartmentHead: hasRole, loading };
};

export const useIsSurveyStaff = () => {
  const { hasRole, loading } = useHasRole("SURVEY_STAFF");
  return { isSurveyStaff: hasRole, loading };
};

export const useIsConstructionDepartmentHead = () => {
  const { hasRole, loading } = useHasRole("CONSTRUCTION_DEPARTMENT_HEAD");
  return { isConstructionDepartmentHead: hasRole, loading };
};
