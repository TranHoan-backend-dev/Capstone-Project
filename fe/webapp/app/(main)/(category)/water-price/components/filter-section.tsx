"use client";

import React, { useState, useEffect } from "react";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import FilterButton from "@/components/ui/FilterButton";
import { AddNewIcon } from "@/config/chip-and-icon";
import { FilterSectionWaterPriceProps } from "@/types";

export const FilterSection = ({
  filter,
  onSearch,
  onAddNew,
}: FilterSectionWaterPriceProps) => {
  const [applicationPeriod, setApplicationPeriod] = useState(
    filter.applicationPeriod ?? "",
  );

  useEffect(() => {
    setApplicationPeriod(filter.applicationPeriod ?? "");
  }, [filter.applicationPeriod]);

  const handleSearch = () => {
    onSearch({
      applicationPeriod: applicationPeriod || undefined,
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
            className="bg-green-500 hover:bg-green-600 mr-2"
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
        <CustomInput
          label="Kỳ áp dụng"
          type="date"
          value={applicationPeriod}
          onChange={(e) => setApplicationPeriod(e.target.value)}
          isInvalid={false}
          validationBehavior="aria"
        />
      </section>
    </GenericSearchFilter>
  );
};
