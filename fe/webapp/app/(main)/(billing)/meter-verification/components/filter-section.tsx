"use client";

import React from "react";
import { FunnelIcon, TrashIcon } from "@heroicons/react/24/outline";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import CustomButton from "@/components/ui/custom/CustomButton";

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
          <CustomButton
            className="px-8 h-10 text-sm font-bold bg-[#2266db] hover:bg-blue-700 rounded-md"
            color="primary"
            startContent={<FunnelIcon className="w-4 h-4" />}
          >
            Lọc
          </CustomButton>
          <CustomButton
            className="px-4 h-10 text-sm font-bold bg-[#ff4d4f] text-white hover:bg-red-600 rounded-md"
            startContent={<TrashIcon className="w-4 h-4" />}
          >
            Xóa toàn bộ lựa chọn
          </CustomButton>
        </div>
      }
      gridClassName="grid grid-cols-1 md:grid-cols-4 gap-6"
      title=""
    >
      <InputField label="Kỳ hóa đơn" />

      <div className="space-y-1">
        <CustomDatePicker label="Ngày ghi" />
      </div>

      <InputField label="Mã khách hàng" />
      <InputField label="Số ghi" />

      {selectFields.map((field) => (
        <div className="space-y-1">
          <CustomSelect
            label={field.label}
            options={field.options.map((item, _) => ({
              label: item.label,
              value: item.key,
            }))}
            itemClassname="dark:text-white"
          />
        </div>
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
