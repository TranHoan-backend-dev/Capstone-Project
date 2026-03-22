export interface EmployeeItem {
  id: string;
  stt: string;
  name: string;
  phoneNumber: string;
}
export interface EmployeeFormProps {
  initialData?: {
    id?: string;
    name?: string;
    phoneNumber?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface EmployeeFilter {
  keyword?: string;
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
  departmentId: string;
  name: string;
  phoneNumber: string;
}
