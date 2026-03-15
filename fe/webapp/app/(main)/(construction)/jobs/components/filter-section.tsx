"use client";

import React, { useState, useEffect } from "react";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import { AddNewIcon } from "@/config/chip-and-icon";
import FilterButton from "@/components/ui/FilterButton";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import { FilterSectionJobProps } from "@/types";
import { useIsITStaff } from "@/hooks/useHasRole";

export const FilterSection = ({
  keyword,
  onSearch,
  onAddNew,
}: FilterSectionJobProps) => {
  const { isITStaff } = useIsITStaff();
  const [name, setName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleSearch = () => {
    onSearch({ name: name.trim() });
  };

  useEffect(() => {
    setName(keyword.name || "");
    setFromDate(keyword.fromDate || "");
    setToDate(keyword.toDate || "");
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
          <FilterButton onPress={handleSearch} />
        </div>
      }
    >
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <CustomInput
            label="Từ khóa"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          {/* <CustomInput
            label="Từ ngày"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <CustomInput
            label="Đến ngày"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          /> */}
        </div>
      </section>
    </GenericSearchFilter>
  );
};
