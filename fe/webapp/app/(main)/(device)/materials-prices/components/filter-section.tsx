"use client";

import React, { useState } from "react";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import FilterButton from "@/components/ui/FilterButton";
import { AddNewIcon } from "@/config/chip-and-icon";
import { FilterSectionMaterialPriceProps } from "@/types";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { LookupModal } from "@/components/ui/modal/LookupModal";

export const FilterSection = ({
  onSearch,
  onAddNew,
}: FilterSectionMaterialPriceProps) => {
  const [laborCode, setLaborCode] = useState("");
  const [jobContent, setJobContent] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");

  const handleSearch = () => {
    onSearch({
      laborCode,
      jobContent,
      groupId: selectedGroupId,
      minPrice,
      maxPrice,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <GenericSearchFilter
      title="Tìm kiếm"
      icon={<SearchIcon size={18} />}
      gridClassName="block space-y-6"
      isCollapsible={false}
      actions={
        <div className="flex justify-end gap-3">
          <FilterActionButton
            className="bg-green-500 hover:bg-green-600"
            color="success"
            icon={<AddNewIcon className="w-4 h-4" />}
            label="Thêm mới"
            onPress={onAddNew}
          />
          <FilterButton onPress={handleSearch} />
        </div>
      }
    >
      <div className="space-y-6" onKeyDown={handleKeyDown}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomInput
            label="Mã hiệu nhân công"
            value={laborCode}
            onChange={(e) => setLaborCode(e.target.value)}
          />

          <CustomInput
            label="Nội dung"
            value={jobContent}
            onChange={(e) => setJobContent(e.target.value)}
          />
          <SearchInputWithButton
            label="Nhóm vật tư"
            value={selectedGroupName}
            onSearch={() => setShowGroupModal(true)}
            onChange={(e) => {
              setSelectedGroupName(e.target.value);

              if (!e.target.value) {
                setSelectedGroupId("");
              }
            }}
          />
          <LookupModal
            isOpen={showGroupModal}
            onClose={() => setShowGroupModal(false)}
            title="Chọn nhóm vật tư"
            api="/api/device/materials-group"
            columns={[
              { key: "stt", label: "STT" },
              { key: "name", label: "Tên nhóm" },
            ]}
            mapData={(item, index, page) => ({
              stt: index + 1,
              id: item.groupId,
              name: item.name,
            })}
            onSelect={(item) => {
              setSelectedGroupId(item.id);
              setSelectedGroupName(item.name);
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Giá từ"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          <CustomInput
            label="Giá đến"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
    </GenericSearchFilter>
  );
};
