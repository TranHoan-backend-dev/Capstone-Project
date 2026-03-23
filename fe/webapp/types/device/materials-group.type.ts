export interface MaterialGroupItem {
  stt: string;
  id: string;
  name: string;
}

export interface MaterialGroupFormProps {
  initialData?: {
    id?: string;
    name?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface MaterialGroupFilter {
  name?: string;
}

export interface FilterSectionMaterialGroupProps {
  filter: MaterialGroupFilter;
  onSearch: (filter: MaterialGroupFilter) => void;
  onAddNew: () => void;
}

export interface MaterialGroupTableProps {
  filter: MaterialGroupFilter;
  reloadKey: number;
  onEdit: (item: MaterialGroupItem) => void;
  onDeleted: () => void;
}

export interface MaterialGroupResponse {
  groupId: string;
  name: string;
}
