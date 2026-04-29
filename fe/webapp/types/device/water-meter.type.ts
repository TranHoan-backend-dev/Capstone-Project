export interface WaterMeterItem {
  id: string;
  stt: number;
  name: string;
  meterModel: string;
  maxIndex: string;
  diameter: string;
  origin: string;
  size: string;
  qn: string;
  qt:string;
  qmin: string;
}

export interface WaterMeterFilter {
  name?: string;
  meterModel?: string;
  maxIndex?: string;
  diameter?: string;
  origin?: string;
  size?: string;
  qn?: string;
  qt?:string;
  qmin?: string;
}

export interface FilterSectionWaterMeterProps {
  filter: WaterMeterFilter;
  onSearch: (value: WaterMeterFilter) => void;
  onAddNew: () => void;
}

export interface WaterMeterFormProps {
  initialData?: {
    id?: string;
    name?: string;
    meterModel?: string;
    origin?: string;
    size?: string;
    maxIndex?: string;
    diameter?: string;
    qn?: string;
    qt?: string;
    qmin?: string;
    indexLength?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface WaterMeterTableProps {
  filter: WaterMeterFilter;
  reloadKey: number;
  onEdit: (item: WaterMeterItem) => void;
  onDeleted: () => void;
}

export interface WaterMeterResponse {
  typeId: string;
  stt: number;
  name: string;
  meterModel: string;
  maxIndex: string;
  diameter: string;
  origin: string;
  size: string;
  qn: string;
  qt:string;
  qmin: string;
}
