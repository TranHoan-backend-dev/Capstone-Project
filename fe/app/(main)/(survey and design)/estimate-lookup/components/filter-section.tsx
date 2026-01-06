"use client";

import React from "react";

import { SearchIcon } from "@/components/ui/Icons";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import CustomSingleDatePicker from "@/components/ui/custom/CustomSingleDatePicker";
import CustomInput from "@/components/ui/custom/CustomInput";

export const FilterSection = () => {
  return (
    <GenericSearchFilter
      isCollapsible
      gridClassName="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4"
      icon={<SearchIcon size={18} />}
      title="Tra cứu dự toán"
    >
      <InputField label="Từ khóa" />
      <DatePickerField label="Từ ngày" />
      <DatePickerField label="Đến ngày" />

      <InputField label="Mã vật tư" />
      <InputField label="Tên đường" />
    </GenericSearchFilter>
  );
};

export const DatePickerField = ({
  label,
  colSpan = "md:col-span-4",
}: {
  label: string;
  colSpan?: string;
}) => {
  return (
    <div className={`${colSpan} space-y-1`}>
      <CustomSingleDatePicker className="font-bold" label={label} />
    </div>
  );
};

export const InputField = ({
  label,
  colSpan = "md:col-span-4",
}: {
  label: string;
  colSpan?: string;
}) => {
  return (
    <div className={`${colSpan} space-y-1`}>
      <CustomInput className="font-bold" label={label} />
    </div>
  );
};
