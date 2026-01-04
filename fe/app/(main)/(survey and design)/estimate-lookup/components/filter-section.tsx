"use client";

import React from "react";
import { DatePicker, Input } from "@heroui/react";

import { SearchIcon } from "@/components/ui/Icons";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";

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
      <DatePicker
        className="font-bold"
        label={label}
        labelPlacement="inside"
        radius="md"
        size="md"
        variant="bordered"
      />
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
      <Input
        className="font-bold"
        label={label}
        labelPlacement="inside"
        radius="md"
        size="md"
        variant="bordered"
      />
    </div>
  );
};
