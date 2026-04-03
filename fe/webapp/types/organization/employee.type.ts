export interface EmployeeItem {
  id: string;
  stt: number;
  fullName: string;
  name?: string; // để tương thích
  phoneNumber: string;
  email: string;
  role?: Role;
  departmentId?: string;
  networkId?: string;
  departmentName?: string;
  jobs?: string;
  isEnabled?: boolean;
}

export interface EmployeeFormProps {
  initialData?: {
    id?: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
    departmentId?: string;
    networkId?: string;
    role?: Role;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface EmployeeFilter {
  keyword?: string;
  role?: Role;
  isEnabled?: boolean;
}

export interface FilterSectionEmployeeProps {
  filter: EmployeeFilter;
  onSearch: (value: EmployeeFilter) => void;
  onAddNew: () => void;
}

export interface EmployeeTableProps {
  keyword: EmployeeFilter;
  reloadKey: number;
  onEdit: (item: EmployeeItem) => void;
  onDeleted: () => void;
}

export interface EmployeeResponse {
  userId: string;
  fullName: string;
  email: string;
  departmentName: string;
  jobs: string;
  phoneNumber?: string;
  isEnabled?: boolean;
}

export type Role =
  | "it_staff"
  | "survey_staff"
  | "planning_technical_department_head"
  | "order_receiving_staff"
  | "finance_department"
  | "construction_department_head"
  | "construction_department_staff"
  | "business_department_head"
  | "meter_inspection_staff"
  | "company_leadership";

export interface RoleMeta {
  label: string;
  department?: string;
}

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
