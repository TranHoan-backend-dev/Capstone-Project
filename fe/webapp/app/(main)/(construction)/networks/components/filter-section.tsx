"use client";

import React, { useState, useEffect } from "react";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import FilterButton from "@/components/ui/FilterButton";
import { FilterActionButton } from "@/components/ui/FilterActionButton";

interface FilterSectionProps {
  keyword: string;
  onSearch: (value: string) => void;
}

export const FilterSection = ({ keyword, onSearch }: FilterSectionProps) => {
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
            icon={<CheckApprovalIcon className="w-4 h-4" />}
            label="Lưu"
            onPress={() => {}}
          />
          <FilterButton onPress={() => onSearch(inputValue)} />
        </div>
      }
    >
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="md:col-span-1">
            <CustomInput
              label="Từ khóa"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        </div>
      </section>
    </GenericSearchFilter>
  );
};
