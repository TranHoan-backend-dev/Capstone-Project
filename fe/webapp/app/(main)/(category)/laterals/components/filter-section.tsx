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
import { FilterSectionProps } from "@/types";

export const FilterSection = ({
  filter,
  onSearch,
  onAddNew,
}: FilterSectionProps) => {
  const [code, setCode] = useState(filter.code ?? "");
  const [name, setName] = useState(filter.name ?? "");
  const [selectedNetwork, setSelectedNetwork] = useState<Set<string>>(
    new Set(),
  );
  const { networkOptions } = useNetwork();

  useEffect(() => {
    setCode(filter.code ?? "");
    setName(filter.name ?? "");

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
                code: code.trim(),
                name: name.trim(),
                networkId: Array.from(selectedNetwork)[0],
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
              label="Mã nhánh tổng"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <CustomInput
              label="Tên nhánh tổng"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="md:col-span-1 flex flex-col gap-4">
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
