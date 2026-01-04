"use client";

import React from "react";

import { SearchIcon } from "@/components/ui/Icons";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";

interface FilterSectionProps {
  branches: { label: string; value: string }[];
  areas: { label: string; value: string }[];
  districts: { label: string; value: string }[];
  wards: { label: string; value: string }[];
}

export const FilterSection = ({
  branches,
  areas,
  districts,
  wards,
}: FilterSectionProps) => {
  const inputFields = [
    { label: "Mã KH", placeholder: "Nhập mã khách hàng" },
    { label: "Số hợp đồng", placeholder: "Nhập số hợp đồng" },
    { label: "Mã đồng hồ", placeholder: "Nhập mã đồng hồ" },
    { label: "Tên khách hàng", placeholder: "Nhập tên khách hàng" },
    { label: "Số nhà", placeholder: "Nhập số nhà" },
    { label: "Lộ trình ghi", placeholder: "Nhập lộ trình ghi" },
    { label: "Tên đường", placeholder: "Nhập tên đường" },
    { label: "MST", placeholder: "Nhập mã số thuế" },
  ];

  const selectFields = [
    { label: "Chi nhánh", data: branches },
    { label: "Khu vực", data: areas },
    { label: "Phường/Xã", data: wards },
  ];

  return (
    <GenericSearchFilter
      isCollapsible
      gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3"
      icon={<SearchIcon size={18} />}
      title="Bộ lọc tìm kiếm"
    >
      {inputFields.map((field) => (
        <div key={field.label} className="space-y-1">
          <CustomInput className="font-bold" label={field.label} />
        </div>
      ))}

      {selectFields.map((field) => (
        <div key={field.label} className="space-y-1">
          <CustomSelect
            aria-label={field.label}
            className="font-bold"
            label={field.label}
            options={field.data}
          />
        </div>
      ))}
    </GenericSearchFilter>
  );
};
