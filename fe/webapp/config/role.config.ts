import { Role } from "@/constants/roles";

type RoleMeta = {
  label: string;
  department?: string;
};

export const ROLE_META: Record<Role, RoleMeta> = {
  it_staff: {
    label: "Nhân viên IT",
    department: "IT",
  },
  survey_staff: {
    label: "Nhân viên khảo sát",
  },
  planning_technical_department_head: {
    label: "Trưởng phòng Kế hoạch - Kỹ thuật",
  },
  order_receiving_staff: {
    label: "Nhân viên nhận đơn",
  },
  finance_department: {
    label: "Nhân viên tài vụ",
  },
  construction_department_head: {
    label: "Trưởng phòng thi công",
  },
  construction_department_staff: {
    label: "Nhân viên thi công",
  },
  business_department_head: {
    label: "Trưởng phòng kinh doanh",
  },
  meter_inspection_staff: {
    label: "Nhân viên kiểm tra đồng hồ",
  },
  company_leadership: {
    label: "Giám đốc",
  },
};
