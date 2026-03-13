"use client";

import React, { useState } from "react";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import FilterButton from "@/components/ui/FilterButton";
import { AddNewIcon } from "@/config/chip-and-icon";
import { FilterSectionMaterialPriceProps } from "@/types";

const unitOptions = [
  { label: "Kg", value: "kg" },
  { label: "m", value: "m" },
  { label: "Cái", value: "piece" },
];

const groupOptions = [
  { label: "Ống", value: "pipe" },
  { label: "Phụ kiện", value: "accessory" },
];

export const FilterSection = ({
  onSearch,
  onAddNew,
}: FilterSectionMaterialPriceProps) => {
  const [materialCode, setMaterialCode] = useState("");
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");

  const [unit, setUnit] = useState(new Set<string>());
  const [group, setGroup] = useState(new Set<string>());

  const [price, setPrice] = useState("");
  const [laborPrice, setLaborPrice] = useState("");
  const [laborPriceDistrict, setLaborPriceDistrict] = useState("");
  const [machinePrice, setMachinePrice] = useState("");
  const [machinePriceDistrict, setMachinePriceDistrict] = useState("");

  const handleSearch = () => {
    onSearch({
      materialCode,
      symbol,
      name,
      unit: Array.from(unit)[0] || "",
      group: Array.from(group)[0] || "",
      price,
      laborPrice,
      laborPriceDistrict,
      machinePrice,
      machinePriceDistrict,
    });
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
      <div className="space-y-6">
        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomInput
            label="Mã vật tư"
            value={materialCode}
            onChange={(e) => setMaterialCode(e.target.value)}
          />
          <CustomInput
            label="Mã hiệu"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
          <CustomInput
            label="Tên vật tư"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomSelect
            label="Đơn vị tính"
            selectedKeys={unit}
            onSelectionChange={setUnit}
            options={unitOptions}
          />

          <CustomSelect
            label="Nhóm vật tư"
            selectedKeys={group}
            onSelectionChange={setGroup}
            options={groupOptions}
          />

          <CustomInput
            label="Giá vật tư"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* ROW 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Giá nhân công"
            value={laborPrice}
            onChange={(e) => setLaborPrice(e.target.value)}
          />
          <CustomInput
            label="Giá nhân công phường/xã"
            value={laborPriceDistrict}
            onChange={(e) => setLaborPriceDistrict(e.target.value)}
          />
        </div>

        {/* ROW 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomInput
            label="Giá máy thi công"
            value={machinePrice}
            onChange={(e) => setMachinePrice(e.target.value)}
          />
          <CustomInput
            label="Giá máy thi công phường/xã"
            value={machinePriceDistrict}
            onChange={(e) => setMachinePriceDistrict(e.target.value)}
          />
        </div>
      </div>
    </GenericSearchFilter>
  );
};
