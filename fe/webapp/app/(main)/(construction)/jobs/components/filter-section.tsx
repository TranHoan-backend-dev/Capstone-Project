"use client";

import React, { useState, useEffect } from "react";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import { AddNewIcon } from "@/config/chip-and-icon";
import FilterButton from "@/components/ui/FilterButton";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import { FilterSectionNetworksProps } from "@/types";
import { useIsITStaff } from "@/hooks/useHasRole";

export const FilterSection = ({
  keyword,
  onSearch,
  onAddNew,
}: FilterSectionNetworksProps) => {
  const { isITStaff } = useIsITStaff();
  const [name, setName] = useState("");
  useEffect(() => {
    setName(keyword.name || "");
  }, [keyword]);

  return (
    <GenericSearchFilter
      title="Tìm kiếm"
      icon={<SearchIcon size={18} />}
      gridClassName="block space-y-10"
      isCollapsible={false}
      actions={
        <div className="flex justify-end gap-3">
          {isITStaff && (
            <FilterActionButton
              className="bg-green-500 hover:bg-green-600 dark:shadow-md dark:shadow-success/40 mr-2"
              color="success"
              icon={<AddNewIcon className="w-4 h-4" />}
              label="Thêm mới"
              onPress={onAddNew}
            />
          )}
          <FilterButton onPress={() => onSearch({ name })} />
        </div>
      }
    >
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="md:col-span-1">
            <CustomInput
              label="Từ khóa"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
      </section>
    </GenericSearchFilter>
  );
};
