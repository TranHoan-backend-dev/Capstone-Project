"use client";

import React, { useState, useEffect } from "react";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import { AddNewIcon } from "@/config/chip-and-icon";
import FilterButton from "@/components/ui/FilterButton";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { FilterRoadmapProps } from "@/types";
import { useNetwork } from "@/hooks/useNetworks";
import { useLateral } from "@/hooks/useLaterals";

export const FilterSection = ({
  filter,
  onSearch,
  onAddNew,
}: FilterRoadmapProps) => {
  const [keyword, setKeyword] = useState(filter.keyword ?? "");
  
  const [selectedNetwork, setSelectedNetwork] = useState<Set<string>>(
    new Set(),
  );
  const [selectedLateral, setSelectedLateral] = useState<Set<string>>(
    new Set(),
  );
  const { networkOptions } = useNetwork();
  const { lateralOptions } = useLateral();

  useEffect(() => {
    setKeyword(filter.keyword ?? "");
    if (filter.networkId) {
      setSelectedNetwork(new Set([filter.networkId]));
    } else {
      setSelectedNetwork(new Set());
    }
    if (filter.lateralId) {
      setSelectedLateral(new Set([filter.lateralId]));
    } else {
      setSelectedLateral(new Set());
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
                lateralId: Array.from(selectedLateral)[0],
              })
            }
          />
        </div>
      }
    >
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1 flex flex-col gap-4">
            <CustomInput
              label="Tên lộ trình ghi"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="md:col-span-1 flex flex-col gap-4">
            <CustomSelect
              label="Nhánh tổng"
              options={lateralOptions}
              selectedKeys={selectedLateral}
              onSelectionChange={setSelectedLateral}
            />
            <CustomSelect
              label="Chi nhánh"
              options={networkOptions}
              selectedKeys={selectedNetwork}
              onSelectionChange={setSelectedNetwork}
            />
          </div>
        </div>
      </section>
    </GenericSearchFilter>
  );
};
