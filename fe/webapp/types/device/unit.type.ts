export interface UnitItem {
  id: string;
  stt: string;
  name: string;
}

export interface UnitFilter {
  code?: string;
  name?: string;
}

export interface UnitFormProps {
  initialData?: {
    id?: string;
    code?: string;
    name?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface FilterSectionUnitProps {
  filter: UnitFilter;
  onSearch: (value: UnitFilter) => void;
  onAddNew: () => void;
}

export interface UnitTableProps {
  filter: UnitFilter;
  reloadKey: number;
  onEdit: (item: UnitItem) => void;
  onDeleted: () => void;
}

export interface UnitResponse {
  id: string;
  name: string;
}