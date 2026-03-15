"use client";

import React, { useState } from "react";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import FilterButton from "@/components/ui/FilterButton";
import { AddNewIcon } from "@/config/chip-and-icon";
import { FilterSectionMaterialGroupProps } from "@/types";

export const FilterSection = ({
  onSearch,
  onAddNew,
}: FilterSectionMaterialGroupProps) => {

  const [name, setName] = useState("");

  const handleSearch = () => {
    onSearch({
      name,
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
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <CustomInput
            label="Tên vật tư"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>
    </GenericSearchFilter>
  );
};
