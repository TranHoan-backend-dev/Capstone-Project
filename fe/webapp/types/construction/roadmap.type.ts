export interface RoadmapItem {
  id: string;
  stt: string;
  name: string;
  lateralId: string;
  lateralName: string;
  networkId: string;
  networkName: string;
}

export interface RoadmapFilter {
  code?: string;
  name?: string;
  lateralId?: string;
  networkId?: string;
}

export interface FilterRoadmapProps {
  filter: RoadmapFilter;
  onSearch: (value: RoadmapFilter) => void;
  onAddNew: () => void;
}

export interface RoadmapFormProps {
  initialData?: {
    id?: string;
    code?: string;
    name?: string;
    lateralId?: string;
    networkId?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface RoadmapTableProps {
  filter: RoadmapFilter;
  reloadKey: number;
  onEdit: (item: RoadmapItem) => void;
  onDeleted: () => void;
}

export interface RoadmapResponse {
  roadmapId: string;
  name: string;
  type: string;
  lateralId: string;
  lateralName: string;
  networkId: string;
  networkName: string;
}
