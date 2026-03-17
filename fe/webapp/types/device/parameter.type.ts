export interface ParameterItem {
  id: string;
  stt: string;
  name: string;
  value: number;
  creator: string;
  updator: string;
}

export interface ParameterFormProps {
  initialData?: {
    id?: string;
    name?: string;
    value?: number;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface FilterSectionParameterProps {
  filter: string;
  onSearch: (value: string) => void;
}

export interface ParameterTableProps {
  filter: string;
  reloadKey: number;
  onEdit: (item: ParameterItem) => void;
}

export interface ParameterResponse {
  id: string;
  name: string;
  value: number;
  creatorName: string;
  updatorName: string;
}
