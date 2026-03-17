import { useEmployeeProfile } from "./useEmployeeProfile";

/**
 * Hook để kiểm tra xem user có role nhất định hay không
 * @param requiredRole - Role cần kiểm tra (ví dụ: 'IT_STAFF')
 * @returns { hasRole: boolean, loading: boolean }
 */
export const useHasRole = (requiredRole: string) => {
  const { profile, loading } = useEmployeeProfile();

  const hasRole = profile?.role === requiredRole;

  return { hasRole, loading };
};

/**
 * Hook để kiểm tra xem user có bất kỳ role nào trong danh sách không
 * @param requiredRoles - Danh sách roles cần kiểm tra
 * @returns { hasRole: boolean, loading: boolean }
 */
export const useHasAnyRole = (requiredRoles: string[]) => {
  const { profile, loading } = useEmployeeProfile();

  const hasRole = profile?.role ? requiredRoles.includes(profile.role) : false;

  return { hasRole, loading };
};

/**
 * Hook để kiểm tra xem user có phải IT_STAFF không
 * @returns { isITStaff: boolean, loading: boolean }
 */
export const useIsITStaff = () => {
  const { hasRole, loading } = useHasRole("it_staff");

  return { isITStaff: hasRole, loading };
};
