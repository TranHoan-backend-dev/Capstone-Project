export const getRoleVietnamese = (role: string) => {
  const roleMap: Record<string, string> = {
    "COMPANY_LEADERSHIP": "Lãnh đạo công ty",
    "PLANNING_TECHNICAL_DEPARTMENT_HEAD": "Trưởng phòng Kế hoạch Kỹ thuật",
    "SURVEY_STAFF": "Nhân viên khảo sát",
    "CONSTRUCTION_DEPARTMENT_HEAD": "Giám đốc chi nhánh Xây lắp",
    "IT_STAFF": "Quản trị viên",
    "FINANCE_DEPARTMENT": "Nhân viên tài vụ",
  };
  return roleMap[role] || role.replace(/_/g, " ");
};