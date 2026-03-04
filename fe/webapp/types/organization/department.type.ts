export interface DepartmentItem {
  id: string;
  stt: string;
  name: string;
  phone: string;
}
export interface DepartmentFormProps {
  initialData?: {
    id?: string;
    name?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface DepartmentFilter {
  keyword?: string;
  phoneNumber?: string;
}

export interface FilterSectionDepartmentProps {
  filter: DepartmentFilter;
  onSearch: (value: DepartmentFilter) => void;
  onAddNew: () => void;
}

export interface DepartmentTableProps {
  keyword: DepartmentFilter;
  reloadKey: number;
  onEdit: (item: DepartmentItem) => void;
  onDeleted: () => void;
}

export interface DepartmentResponse {
  departmentId: string;
  name: string;
  phoneNumber: string;
}
