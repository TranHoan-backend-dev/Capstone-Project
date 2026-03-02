export interface LateralItem {
  id: string;
  stt: string;
  name: string;
  networkId: string;
  networkName: string;
}

export interface LateralFilter {
  code?: string;
  name?: string;
  networkId?: string;
}

export interface FilterNetworkProps {
  filter: LateralFilter;
  onSearch: (value: LateralFilter) => void;
  onAddNew: () => void;
}

export interface LateralFormProps {
  initialData?: {
    id?: string;
    code?: string;
    name?: string;
    networkId?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface LateralTableProps {
  filter: LateralFilter;
  reloadKey: number;
  onEdit: (item: LateralItem) => void;
  onDeleted: () => void;
}

export interface LateralResponse {
  id: string;
  name: string;
  networkId: string;
  networkName: string;
}
