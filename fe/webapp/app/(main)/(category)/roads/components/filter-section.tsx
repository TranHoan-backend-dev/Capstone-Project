
"use client";

import React, { useState, useEffect } from "react";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import FilterButton from "@/components/ui/FilterButton";
import { AddNewIcon } from "@/config/chip-and-icon";
import { FilterSectionProps } from "@/types";

export const FilterSection = ({
  keyword,
  onSearch,
  onAddNew,
}: FilterSectionProps) => {
  const [inputValue, setInputValue] = useState(keyword);
  useEffect(() => {
    setInputValue(keyword);
  }, [keyword]);

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
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="Mã đường phố"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <CustomInput
              label="Tên đường phố"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        </div>
      </section>
    </GenericSearchFilter>
  );
};
