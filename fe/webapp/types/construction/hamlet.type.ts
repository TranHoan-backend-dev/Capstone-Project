export interface HamletItem {
  id: string;
  stt: string;
  name: string;
  communeId: string;
  communeName: string;
  type: string;
}

export interface HamletFilter {
  name?: string;
  communeId?: string;
  type?: string;
}

export interface HamletFormProps {
  initialData?: {
    id?: string;
    name?: string;
    type?: string;
    communeId?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface FilterSectionHamletProps {
  filter: HamletFilter;
  onSearch: (value: HamletFilter) => void;
  onAddNew: () => void;
}

export interface HamletTableProps {
  filter: HamletFilter;
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
