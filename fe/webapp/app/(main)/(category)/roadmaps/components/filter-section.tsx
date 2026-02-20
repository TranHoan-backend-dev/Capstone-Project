"use client";

import React, { useState, useEffect, useMemo } from "react";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import { AddNewIcon } from "@/config/chip-and-icon";
import FilterButton from "@/components/ui/FilterButton";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import CustomSelect from "@/components/ui/custom/CustomSelect";

interface FilterSectionProps {
  keyword: string;
  onSearch: (value: string) => void;
  onAddNew: () => void;
}
const networks = [
  { label: "A300", value: "A300" },
  { label: "A600c", value: "A600c" },
  { label: "B600m", value: "B600m" },
];

const laterals = [
  { label: "TP Nam Định", value: "tpnd", network: "A600c" },
  { label: "Huyện Ý Yên", value: "yy", network: "A600c" },
  { label: "Huyện Vụ Bản", value: "vb", network: "B600m" },
];
export const FilterSection = ({
  keyword,
  onSearch,
  onAddNew,
}: FilterSectionProps) => {
  const [inputValue, setInputValue] = useState(keyword);
  const [selectedNetwork, setSelectedNetwork] = useState<Set<string>>(
    new Set(),
  );
  const [selectedLateral, setSelectedLateral] = useState<Set<string>>(
    new Set(),
  );
  useEffect(() => {
    setInputValue(keyword);
  }, [keyword]);
  const filteredLaterals = useMemo(() => {
    const network = Array.from(selectedNetwork)[0];

    if (!network) return [];

    return laterals
      .filter((l) => l.network === network)
      .map((l) => ({
        label: l.label,
        value: l.value,
      }));
  }, [selectedNetwork]);
  return (
    <GenericSearchFilter
      title="Tìm kiếm"
      icon={<SearchIcon size={18} />}
      gridClassName="block space-y-10"
      isCollapsible={false}
      actions={
        <div className="flex justify-end gap-3">
          <FilterActionButton
            className="bg-green-500 hover:bg-green-600 dark:shadow-md dark:shadow-success/40 mr-2"
            color="success"
            icon={<AddNewIcon className="w-4 h-4" />}
            label="Thêm mới"
            onPress={onAddNew}
          />
          <FilterButton onPress={() => onSearch(inputValue)} />
        </div>
      }
    >
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1 flex flex-col gap-4">
            <CustomInput
              label="Mã lộ trình ghi"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <CustomInput
              label="Tên lộ trình ghi"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div className="md:col-span-1 flex flex-col gap-4">
            <CustomSelect
              label="Nhánh tổng"
              options={filteredLaterals}
              selectedKeys={selectedLateral}
              onSelectionChange={setSelectedLateral}
              isDisabled={!selectedNetwork.size}
            />
            <CustomSelect
              label="Chi nhánh"
              options={networks}
              selectedKeys={selectedNetwork}
              onSelectionChange={(keys) => {
                setSelectedNetwork(keys);
                setSelectedLateral(new Set());
              }}
            />
          </div>
        </div>
      </section>
    </GenericSearchFilter>
  );
};
