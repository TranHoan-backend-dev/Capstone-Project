export const getRoleVietnamese = (role: string) => {
  const roleMap: Record<string, string> = {
    COMPANY_LEADERSHIP: "Lãnh đạo công ty",
    PLANNING_TECHNICAL_DEPARTMENT_HEAD: "Trưởng phòng Kế hoạch Kỹ thuật",
    SURVEY_STAFF: "Nhân viên khảo sát",
    CONSTRUCTION_DEPARTMENT_HEAD: "Giám đốc chi nhánh Xây lắp",
    IT_STAFF: "Quản trị viên",
    CONSTRUCTION_DEPARTMENT_STAFF: "Nhân viên xây lắp",
    FINANCE_DEPARTMENT: "Nhân viên tài vụ",
    ORDER_RECEIVING_STAFF: "Nhân viên tiếp nhận đơn",
    METER_INSPECTION_STAFF: "Nhân viên chụp ảnh",
    BUSINESS_DEPARTMENT_HEAD: "Trưởng phòng kinh doanh",
  };
  return roleMap[role] || role.replace(/_/g, " ");
};
