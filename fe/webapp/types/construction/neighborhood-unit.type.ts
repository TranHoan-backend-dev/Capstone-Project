export interface NeighborhoodUnitItem {
  id: string;
  stt: string;
  name: string;
  communeId: string;
  communeName: string;
}

export interface NeighborhoodUnitFilter {
  name?: string;
  communeId?: string;
}

export interface FilterSectionNeighborhoodUnitProps {
  filter: NeighborhoodUnitFilter;
  onSearch: (value: NeighborhoodUnitFilter) => void;
  onAddNew: () => void;
}

export interface NeighborhoodUnitFormProps {
  initialData?: {
    id?: string;
    name?: string;
    communeId?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface NeighborhoodTableProps {
  filter: NeighborhoodUnitFilter;
  reloadKey: number;
  onEdit: (item: NeighborhoodUnitItem) => void;
  onDeleted: () => void;
}

export interface NeighborhoodUnitResponse {
  unitId: string;
  name: string;
  communeId: string;
  communeName: string;
}
