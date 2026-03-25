export interface BusinessPageItem {
  id: string;
  stt: number;
  name: string;
  status: string;
  creator: string;
  updator: string;
}

export interface FilterSectionBusinessPageProps {
  filter: string;
  onSearch: (value: string) => void;
  onAddNew: () => void;
}

export interface BusinessPageFormProps {
  initialData?: {
    id?: string;
    name?: string;
    phone?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface BusinessPageTableProps {
  isActive?: boolean | null;
  onEdit: (item: BusinessPageItem) => void;
  onDeleted: () => void;
}

export interface BusinessPageResponse {
  pageId: string;
  name: string;
  activate: boolean;
  creator: string;
  updator: string;
}
