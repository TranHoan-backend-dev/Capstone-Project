"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@heroui/react";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { CheckApprovalIcon, RejectIcon } from "@/config/chip-and-icon";
import FilterButton from "@/components/ui/FilterButton";
import { FilterActionButton } from "@/components/ui/FilterActionButton";

interface FilterSectionProps {
  username: string;
  onSearch: (value: string) => void;
}

export const FilterSection = ({ username, onSearch }: FilterSectionProps) => {
  const [inputValue, setInputValue] = useState(username);
  useEffect(() => {
    setInputValue(username);
  }, [username]);

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
          <SearchInputWithButton
            label="Từ khóa"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSearch={() => onSearch(inputValue)}
          />
        </div>
      </section>
    </GenericSearchFilter>
  );
};
