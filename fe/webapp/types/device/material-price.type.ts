export interface MaterialPriceItem {
  stt: string;
  id: string;
  laborCode: string;
  unitName: string;
  groupName: number;
  jobContent: string;
  price: string;
  laborPrice: string;
  laborPriceAtRuralCommune: string;
  constructionMachineryPrice: string;
  constructionMachineryPriceAtRuralCommune: string;
}

export interface MaterialPriceFormProps {
  initialData?: {
    id?: string;
    name?: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export interface FilterSectionMaterialPriceProps {
  filter: string;
  onSearch: (value: string) => void;
  onAddNew: () => void;
}

export interface MaterialPriceTableProps {
  filter: string;
  reloadKey: number;
  onEdit: (item: MaterialPriceItem) => void;
  onDeleted: () => void;
}

export interface MaterialPriceResponse {
  id: string;
  laborCode: string;
  unitName: string;
  groupName: number;
  jobContent: string;
  price: string;
  laborPrice: string;
  laborPriceAtRuralCommune: string;
  constructionMachineryPrice: string;
  constructionMachineryPriceAtRuralCommune: string;
}
