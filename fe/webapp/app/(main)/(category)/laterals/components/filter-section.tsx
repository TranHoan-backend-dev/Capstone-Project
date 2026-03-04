"use client";

import React, { useState, useEffect } from "react";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import FilterButton from "@/components/ui/FilterButton";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { AddNewIcon } from "@/config/chip-and-icon";
import { useNetwork } from "@/hooks/useNetworks";
import { FilterNetworkProps } from "@/types";

export const FilterSection = ({
  filter,
  onSearch,
  onAddNew,
}: FilterSectionProps) => {
  const [keyword, setKeyword] = useState(filter.keyword ?? "");
  const [selectedNetwork, setSelectedNetwork] = useState<Set<string>>(
    new Set(),
  );
  const { networkOptions } = useNetwork();

  useEffect(() => {
    setKeyword(filter.keyword ?? "");

    if (filter.networkId) {
      setSelectedNetwork(new Set([filter.networkId]));
    } else {
      setSelectedNetwork(new Set());
    }
  }, [filter]);

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
          <FilterButton
            onPress={() =>
              onSearch({
                keyword: keyword.trim(),
                networkId: Array.from(selectedNetwork)[0],
              })
            }
          />
        </div>
      }
    >
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomInput
              label="Tên nhánh tổng"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <CustomSelect
              label="Chi nhánh"
              options={networkOptions}
              selectedKeys={selectedNetwork}
              onSelectionChange={setSelectedNetwork}
            />
          </div>
      </section>
    </GenericSearchFilter>
  );
};
