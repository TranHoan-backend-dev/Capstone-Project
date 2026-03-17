"use client";

import React, { useState, useEffect } from "react";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import FilterButton from "@/components/ui/FilterButton";
import { FilterSectionParameterProps } from "@/types";

export const FilterSection = ({
  filter,
  onSearch,
}: FilterSectionParameterProps) => {
  const [inputValue, setInputValue] = useState(filter);
  useEffect(() => {
    setInputValue(filter);
  }, [filter]);

  return (
    <GenericSearchFilter
      title="Tìm kiếm"
      icon={<SearchIcon size={18} />}
      gridClassName="block space-y-10"
      isCollapsible={false}
      actions={
        <div className="flex justify-end gap-3">
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearch(inputValue);
                }
              }}
            />
          </div>
        </div>
      </section>
    </GenericSearchFilter>
  );
};
