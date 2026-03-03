export interface CommuneItem {
  id: string;
  stt: string;
  name: string;
  type: string;
}

export type CommuneFilter = {
  name: string;
  type?: string;
};

export interface FilterSectionProps {
  keyword: CommuneFilter;
  onSearch: (value: CommuneFilter) => void;
  onAddNew: () => void;
}

export interface CommuneFormProps {
  initialData?: {
    id?: string;
    name: string;
    type?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface CommuneTableProps {
  filter: CommuneFilter;
  reloadKey: number;
  onEdit: (item: CommuneItem) => void;
  onDeleted: () => void;
}

export interface CommuneResponse {
  communeId: string;
  name: string;
  type: string;
}
