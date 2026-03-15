"use client";

import React, { useState } from "react";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import FilterButton from "@/components/ui/FilterButton";
import { AddNewIcon } from "@/config/chip-and-icon";
import { FilterSectionMaterialPriceProps } from "@/types";
import { useUnit } from "@/hooks/useUnit";

export const FilterSection = ({
  onSearch,
  onAddNew,
}: FilterSectionMaterialPriceProps) => {
  const [laborCode, setLaborCode] = useState("");
  const [jobContent, setJobContent] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [group, setGroup] = useState(new Set<string>());

  const { unitOptions } = useUnit();

  const handleSearch = () => {
    onSearch({
      laborCode,
      jobContent,
      groupId: Array.from(group)[0] || "",
      minPrice,
      maxPrice,
    });
  };

  return (
    <GenericSearchFilter
      title="Tìm kiếm"
      icon={<SearchIcon size={18} />}
      gridClassName="block space-y-6"
      isCollapsible={false}
      actions={
        <div className="flex justify-end gap-3">
          <FilterActionButton
            className="bg-green-500 hover:bg-green-600"
            color="success"
            icon={<AddNewIcon className="w-4 h-4" />}
            label="Thêm mới"
            onPress={onAddNew}
          />
          <FilterButton onPress={handleSearch} />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomInput
            label="Mã hiệu nhân công"
            value={laborCode}
            onChange={(e) => setLaborCode(e.target.value)}
          />

          <CustomInput
            label="Nội dung"
            value={jobContent}
            onChange={(e) => setJobContent(e.target.value)}
          />

          <CustomSelect
            label="Nhóm vật tư"
            selectedKeys={group}
            onSelectionChange={setGroup}
            options={unitOptions}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Giá từ"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          <CustomInput
            label="Giá đến"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
    </GenericSearchFilter>
  );
};