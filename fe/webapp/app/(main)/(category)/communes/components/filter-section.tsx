"use client";

import React, { useState, useEffect } from "react";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import { AddNewIcon } from "@/config/chip-and-icon";
import FilterButton from "@/components/ui/FilterButton";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import { FilterSectionProps } from "@/types";
import CustomSelect from "@/components/ui/custom/CustomSelect";

const typeOptions = [
  { label: "Phường", value: "URBAN_WARD" },
  { label: "Xã", value: "RURAL_COMMUNE" },
];

export const FilterSection = ({
  keyword,
  onSearch,
  onAddNew,
}: FilterSectionProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<string | undefined>();

  useEffect(() => {
    setName(keyword.name || "");
    setType(keyword.type || undefined);
  }, [keyword]);
  
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
          <FilterButton
            onPress={() =>
              onSearch({
                name,
                type,
              })
            }
          />
        </div>
      }
    >
      <section className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Tên phường/xã"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <CustomSelect
            label="Loại"
            selectedKeys={type ? [type] : []}
            onSelectionChange={(keys) => setType(Array.from(keys)[0] as string)}
            options={typeOptions}
          />
        </div>
      </section>
    </GenericSearchFilter>
  );
};
