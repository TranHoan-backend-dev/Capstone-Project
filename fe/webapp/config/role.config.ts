import { Role } from "@/constants/roles";

type RoleMeta = {
  label: string;
  department?: string;
};

export const ROLE_META: Record<Role, RoleMeta> = {
  it_department_staff: {
    label: "Nhân viên IT",
    department: "IT",
  },
  planning_technical_department_staff: {
    label: "Nhân viên Kế hoạch - Kỹ thuật",
    department: "Planning",
  },
  planning_technical_department_head: {
    label: "Trưởng phòng Kế hoạch - Kỹ thuật",
    department: "Planning",
  },
  construction_department_staff: {
    label: "Nhân viên Thi công",
  },
  construction_department_head: {
    label: "Trưởng phòng Thi công",
  },
  sales_department_staff: {
    label: "Nhân viên Kinh doanh",
  },
  sales_department_head: {
    label: "Trưởng phòng Kinh doanh",
  },
  finance_department: {
    label: "Phòng Tài chính",
  },
};
