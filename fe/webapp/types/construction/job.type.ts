export interface JobItem {
  id: string;
  stt: string;
  name: string;
}

export type JobFilter = {
  name?: string;
  type?: string;
};

export interface FilterSectionJobProps {
  keyword: JobFilter;
  onSearch: (value: JobFilter) => void;
  onAddNew: () => void;
}

export interface JobFormProps {
  initialData?: {
    id?: string;
    name: string;
    type?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface JobTableProps {
  keyword: JobFilter;
  reloadKey: number;
  onEdit: (item: JobItem) => void;
  onDeleted: () => void;
}

export interface JobResponse {
  branchId: string;
  name: string;
}