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

export interface BusinessPageTableProps {
  filter: string;
  isActive?: boolean | null;
  reloadKey?: number;
  onEdit: (item: BusinessPageItem) => void;
  onDelete: () => void;
}

export interface BusinessPageResponse {
  pageId: string;
  name: string;
  activate: boolean;
  creator: string;
  updator: string;
}