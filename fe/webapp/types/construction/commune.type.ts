export interface CommuneItem {
  id: string;
  stt: string;
  name: string;
  type: string;
}

export interface FilterSectionProps {
  keyword: string;
  onSearch: (value: string) => void;
  onAddNew: () => void;
}

export interface CommuneFormProps {
  initialData?: {
    id?: string;
    name: string;
    type?: string;
  };
  onSuccess: () => void;
}

export interface CommuneTableProps {
  keyword: string;
  reloadKey: number;
  onEdit: (item: CommuneItem) => void;
  onDeleted: () => void;
}

export interface CommuneResponse {
  communeId: string;
  name: string;
  type: string;
}
