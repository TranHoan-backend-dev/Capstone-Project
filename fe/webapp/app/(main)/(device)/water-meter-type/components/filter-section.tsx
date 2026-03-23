"use client";

import React, { useState, useEffect } from "react";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import FilterButton from "@/components/ui/FilterButton";
import { AddNewIcon } from "@/config/chip-and-icon";
import { FilterSectionWaterMeterProps } from "@/types";

export const FilterSection = ({
  filter,
  onSearch,
  onAddNew,
}: FilterSectionWaterMeterProps) => {
  const [formData, setFormData] = useState({
    name: "",
    origin: "",
    meterModel: "",
    size: "",
    maxIndex: "",
    diameter: "",
    qn: "",
    qt: "",
    qmin: "",
  });
  useEffect(() => {
    setFormData({
      name: filter.name ?? "",
      origin: filter.origin ?? "",
      meterModel: filter.meterModel ?? "",
      size: filter.size ?? "",
      maxIndex: filter.maxIndex ?? "",
      diameter: filter.diameter ?? "",
      qn: filter.qn ?? "",
      qt: filter.qt ?? "",
      qmin: filter.qmin ?? "",
    });
  }, [filter]);

  const handleSearch = () => {
    onSearch({
      name: formData.name.trim() || "",
      origin: formData.origin.trim() || "",
      meterModel: formData.meterModel.trim() || "",
      size: formData.size.trim() || "",
      maxIndex: formData.maxIndex.trim() || "",
      diameter: formData.diameter.trim() || "",
      qn: formData.qn.trim() || "",
      qt: formData.qt.trim() || "",
      qmin: formData.qmin.trim() || "",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomInput
            label="Tên loại đồng hồ"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <CustomInput
            label="Kiểu đồng hồ"
            value={formData.meterModel}
            onChange={(e) => handleChange("meterModel", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <CustomInput
            label="Nơi sản xuất"
            value={formData.origin}
            onChange={(e) => handleChange("origin", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <CustomInput
            label="Kích cỡ"
            value={formData.size}
            onChange={(e) => handleChange("size", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <CustomInput
            label="Đường kính"
            value={formData.diameter}
            onChange={(e) => handleChange("diameter", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <CustomInput
            label="CSMax"
            value={formData.maxIndex}
            onChange={(e) => handleChange("maxIndex", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <CustomInput
            label="Qn"
            value={formData.qn}
            onChange={(e) => handleChange("qn", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <CustomInput
            label="Qt"
            value={formData.qt}
            onChange={(e) => handleChange("qt", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <CustomInput
            label="Qmin"
            value={formData.qmin}
            onChange={(e) => handleChange("qmin", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>
      </section>
    </GenericSearchFilter>
  );
};
