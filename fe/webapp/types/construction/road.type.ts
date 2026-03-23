export interface RoadItem {
  id: string;
  stt: string;
  name: string;
}

export interface RoadFormProps {
  initialData?: {
    id?: string;
    name?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface FilterSectionRoadProps {
  keyword: string;
  onSearch: (value: string) => void;
  onAddNew: () => void;
}

export interface RoadTableProps {
  keyword: string;
  reloadKey: number;
  onEdit: (item: RoadItem) => void;
  onDeleted: () => void;
}

export interface RoadResponse {
  roadId: string;
  name: string;
}