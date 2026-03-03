export interface NetworksItem {
  id: string;
  stt: string;
  name: string;
}

export type NetworksFilter = {
  name?: string;
  type?: string;
};

export interface FilterSectionNetworksProps {
  keyword: NetworksFilter;
  onSearch: (value: NetworksFilter) => void;
  onAddNew: () => void;
}

export interface NetworksFormProps {
  initialData?: {
    id?: string;
    name: string;
    type?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface NetworksTableProps {
  keyword: NetworksFilter;
  reloadKey: number;
  onEdit: (item: NetworksItem) => void;
  onDeleted: () => void;
}

export interface NetworksResponse {
  branchId: string;
  name: string;
}