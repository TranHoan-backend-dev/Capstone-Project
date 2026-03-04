"use client";

import React, { useState, useEffect } from "react";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import FilterButton from "@/components/ui/FilterButton";
import { AddNewIcon } from "@/config/chip-and-icon";
import { FilterSectionDepartmentProps } from "@/types";

export const FilterSection = ({
  filter,
  onSearch,
  onAddNew,
}: FilterSectionDepartmentProps) => {
  const [keyword, setKeyword] = useState(filter.keyword ?? "");
  const [phone, setPhone] = useState(filter.phoneNumber ?? "");
  useEffect(() => {
    setKeyword(filter.keyword ?? "");
  }, [filter.keyword]);

  useEffect(() => {
    setPhone(filter.phoneNumber ?? "");
  }, [filter.phoneNumber]);

  const handleSearch = () => {
    onSearch({
      keyword: keyword.trim() || undefined,
      phoneNumber: phone.trim() || undefined,
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
          <FilterButton onPress={handleSearch} />
        </div>
      }
    >
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1">
            <CustomInput
              label="Tên phòng ban"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="md:col-span-1">
            <CustomInput
              label="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
      </section>
    </GenericSearchFilter>
  );
};
