"use client";

import React, { useState } from "react";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import FilterButton from "@/components/ui/FilterButton";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { AddNewIcon } from "@/config/chip-and-icon";

interface FilterSectionProps {
  onSearch: (filters: any) => void;
  onAddNew?: () => void;
}

const customerTypeOptions = [
  { label: "Tất cả", value: "" },
  { label: "Hộ gia đình", value: "FAMILY" },
  { label: "Công ty", value: "COMPANY" },
];

const usageTargetOptions = [
  { label: "Tất cả", value: "" },
  { label: "Sinh hoạt", value: "DOMESTIC" },
  { label: "Cơ quan, hành chính sự nghiệp", value: "INSTITUTIONAL" },
  { label: "Sản xuất", value: "INDUSTRIAL" },
  { label: "Kinh doanh dịch vụ", value: "COMMERCIAL" },
];

export const FilterSection = ({ onSearch, onAddNew }: FilterSectionProps) => {
  const [filters, setFilters] = useState({
    name: "",
    phoneNumber: "",
    citizenIdentificationNumber: "",
    address: "",
    type: "",
    usageTarget: "",
    roadmapId: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    const cleanedFilters = Object.entries(filters).reduce(
      (acc, [key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {} as any,
    );
    onSearch(cleanedFilters);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <GenericSearchFilter
      title="Bộ lọc tìm kiếm"
      icon={<SearchIcon size={18} />}
      gridClassName="block space-y-6"
      isCollapsible
      actions={
        <div className="flex justify-end gap-3">
          {onAddNew && (
            <FilterActionButton
              className="bg-green-500 hover:bg-green-600"
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
      <div className="space-y-6" onKeyDown={handleKeyDown}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CustomInput
            label="Tên khách hàng"
            placeholder="Nhập tên khách hàng"
            value={filters.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <CustomInput
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            value={filters.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          />
          <CustomInput
            label="Số căn cước/CCCD"
            placeholder="Nhập số căn cước"
            value={filters.citizenIdentificationNumber}
            onChange={(e) =>
              handleInputChange("citizenIdentificationNumber", e.target.value)
            }
          />
          <CustomInput
            label="Địa chỉ"
            placeholder="Nhập địa chỉ"
            value={filters.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomSelect
            label="Loại khách hàng"
            options={customerTypeOptions}
            selectedKeys={filters.type ? [filters.type] : []}
            onSelectionChange={(keys) => {
              const selectedValue = Array.from(keys)[0] as string;
              handleInputChange("type", selectedValue);
            }}
          />
          <CustomSelect
            label="Mục đích sử dụng"
            options={usageTargetOptions}
            selectedKeys={filters.usageTarget ? [filters.usageTarget] : []}
            onSelectionChange={(keys) => {
              const selectedValue = Array.from(keys)[0] as string;
              handleInputChange("usageTarget", selectedValue);
            }}
          />
          <CustomInput
            label="Lộ trình ghi"
            placeholder="Nhập lộ trình ghi"
            value={filters.roadmapId}
            onChange={(e) => handleInputChange("roadmapId", e.target.value)}
          />
        </div>
      </div>
    </GenericSearchFilter>
  );
};
