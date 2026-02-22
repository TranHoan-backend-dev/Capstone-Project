export interface HamletItem {
  id: string;
  stt: string;
  name: string;
  communeId: string;
  communeName: string;
  type: string;
}

export interface HamletFormProps {
  initialData?: {
    id?: string;
    code?: string;
    name?: string;
    type?: string;
    communeId?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface FilterSectionProps {
  keyword: string;
  onSearch: (value: string) => void;
  onAddNew: () => void;
}

export interface HamletTableProps {
  keyword: string;
  reloadKey: number;
  onEdit: (item: HamletItem) => void;
  onDeleted: () => void;
}

export interface HamletResponse {
  hamletId: string;
  name: string;
  communeId: string;
  communeName: string;
  type: string;
}
