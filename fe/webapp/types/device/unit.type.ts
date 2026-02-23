export interface UnitItem {
  id: string;
  stt: string;
  name: string;
}

export interface UnitFormProps {
  initialData?: {
    id?: string;
    name?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface FilterSectionUnitProps {
  filter: string;
  onSearch: (value: string) => void;
  onAddNew: () => void;
}

export interface UnitTableProps {
  filter: string;
  reloadKey: number;
  onEdit: (item: UnitItem) => void;
  onDeleted: () => void;
}

export interface UnitResponse {
  id: string;
  name: string;
}