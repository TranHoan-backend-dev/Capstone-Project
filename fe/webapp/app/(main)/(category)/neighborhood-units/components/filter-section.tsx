"use client";

import React, { useState, useEffect } from "react";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import FilterButton from "@/components/ui/FilterButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { useCommune } from "@/hooks/useCommunes";
import { AddNewIcon } from "@/config/chip-and-icon";
import { FilterSectionNeighborhoodUnitProps } from "@/types";

export const FilterSection = ({
  filter,
  onSearch,
  onAddNew,
}: FilterSectionNeighborhoodUnitProps) => {
  const [name, setName] = useState(filter.name ?? "");
  const [selectedCommune, setSelectedCommune] = useState<Set<string>>(
    new Set(),
  );

  const { communeOptions } = useCommune();

  useEffect(() => {
    setName(filter.name ?? "");
    if (filter.communeId) {
      setSelectedCommune(new Set([filter.communeId]));
    } else {
      setSelectedCommune(new Set());
    }
  }, [filter]);

  const handleSearch = () => {
    onSearch({
      name: name.trim(),
      communeId: Array.from(selectedCommune)[0],
    });
  };
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
          <FilterButton onPress={() => handleSearch()} />
        </div>
      }
    >
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Tên tổ/khu phố"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <CustomSelect
            label="Phường/xã"
            options={communeOptions}
            selectedKeys={selectedCommune}
            onSelectionChange={setSelectedCommune}
          />
        </div>
      </section>
    </GenericSearchFilter>
  );
};
