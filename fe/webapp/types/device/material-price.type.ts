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

export interface MaterialPriceFilter {
  laborCode?: string;
  jobContent?: string;
  groupId?: string;
  minPrice?: string;
  maxPrice?: string;
}

export interface FilterSectionMaterialPriceProps {
  filter: MaterialPriceFilter;
  onSearch: (filter: MaterialPriceFilter) => void;
  onAddNew: () => void;
}

export interface MaterialPriceTableProps {
  filter: MaterialPriceFilter;
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
