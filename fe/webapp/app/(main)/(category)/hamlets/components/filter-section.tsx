"use client";

import React, { useState, useEffect } from "react";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import FilterButton from "@/components/ui/FilterButton";
import { AddNewIcon } from "@/config/chip-and-icon";
import { FilterSectionHamletProps } from "@/types";
import { useCommune } from "@/hooks/useCommunes";
import CustomSelect from "@/components/ui/custom/CustomSelect";

const typeOptions = [
  { label: "Thôn", value: "HAMLET" },
  { label: "Làng", value: "VILLAGE" },
];

export const FilterSection = ({
  filter,
  onSearch,
  onAddNew,
}: FilterSectionHamletProps) => {
  const [name, setName] = useState(filter.name ?? "");
  const [type, setType] = useState(filter?.type || "");
  const [selectedCommune, setSelectedCommune] = useState<Set<string>>(
    new Set(),
  );
  const { communeOptions } = useCommune();

  useEffect(() => {
    setName(filter.name ?? "");
    setType(filter.type ?? "");
    if (filter.communeId) {
      setSelectedCommune(new Set([filter.communeId]));
    } else {
      setSelectedCommune(new Set());
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
                name: name.trim(),
                type: type,
                communeId: Array.from(selectedCommune)[0],
              })
            }
          />
        </div>
      }
    >
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1 flex flex-col gap-4">
            <CustomInput
              label="Tên thôn/làng"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="md:col-span-1 flex flex-col gap-4">
            <CustomSelect
              label="Phường/xã"
              options={communeOptions}
              selectedKeys={selectedCommune}
              onSelectionChange={setSelectedCommune}
            />
            <CustomSelect
              label="Loại"
              selectedKeys={type ? [type] : []}
              onSelectionChange={(keys) =>
                setType(Array.from(keys)[0] as string)
              }
              options={typeOptions}
            />
          </div>
        </div>
      </section>
    </GenericSearchFilter>
  );
};
