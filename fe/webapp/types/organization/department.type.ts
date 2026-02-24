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

export interface FilterSectionDepartmentProps {
  keyword: string;
  onSearch: (value: string) => void;
  onAddNew: () => void;
}

export interface DepartmentTableProps {
  keyword: string;
  reloadKey: number;
  onEdit: (item: DepartmentItem) => void;
  onDeleted: () => void;
}

export interface DepartmentResponse {
  departmentId: string;
  name: string;
  phoneNumber: string;
}
