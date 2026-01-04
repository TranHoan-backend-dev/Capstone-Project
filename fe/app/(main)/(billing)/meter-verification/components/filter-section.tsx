"use client";

import React from "react";
import { Button, DatePicker, Select, SelectItem } from "@heroui/react";
import { FunnelIcon, TrashIcon } from "@heroicons/react/24/outline";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import CustomInput from "@/components/ui/custom/CustomInput";

export const FilterSection = () => {
  const selectFields = [
    { label: "Chi nhánh", options: [{ key: "1", label: "Chi nhánh 1" }] },
    { label: "Trạng thái cúp", options: [{ key: "1", label: "Tất cả" }] },
    { label: "Tình trạng đồng hồ", options: [{ key: "1", label: "Tất cả" }] },
    {
      label: "Trạng thái ghi chỉ số",
      options: [{ key: "1", label: "Tất cả" }],
    },
  ];

  return (
    <GenericSearchFilter
      actions={
        <div className="flex gap-2">
          <Button
            className="px-8 h-10 text-sm font-bold bg-[#2266db] hover:bg-blue-700 rounded-md"
            color="primary"
            startContent={<FunnelIcon className="w-4 h-4" />}
          >
            Lọc
          </Button>
          <Button
            className="px-4 h-10 text-sm font-bold bg-[#ff4d4f] text-white hover:bg-red-600 rounded-md"
            startContent={<TrashIcon className="w-4 h-4" />}
          >
            Xóa toàn bộ lựa chọn
          </Button>
        </div>
      }
      gridClassName="grid grid-cols-1 md:grid-cols-4 gap-6"
      title=""
    >
      <InputField label="Kỳ hóa đơn" />

      <div className="space-y-1">
        <DatePicker
          label="Ngày ghi"
          labelPlacement="inside"
          radius="md"
          size="md"
          variant="bordered"
        />
      </div>

      <InputField label="Mã khách hàng" />
      <InputField label="Số ghi" />

      {selectFields.map((field) => (
        <SelectField
          key={field.label}
          label={field.label}
          options={field.options}
        />
      ))}
    </GenericSearchFilter>
  );
};

export const InputField = ({ label }: { label: string }) => {
  return (
    <div className="space-y-1">
      <CustomInput label={label} />
    </div>
  );
};

export const SelectField = ({
  label,
  options,
}: {
  label: string;
  options: { key: string; label: string }[];
}) => {
  return (
    <div className="space-y-1">
      <Select
        label={label}
        labelPlacement="inside"
        radius="md"
        size="md"
        variant="bordered"
      >
        {options.map((opt) => (
          <SelectItem key={opt.key} className="dark:text-white">
            {opt.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};
