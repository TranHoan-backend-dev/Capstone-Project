"use client";

import React from "react";
import { Input, DatePicker } from "@heroui/react";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";

export const FilterSection = () => {
  return (
    <GenericSearchFilter
      isCollapsible
      gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3"
      icon={<SearchIcon size={18} />}
      title="Tra cứu quyết toán"
    >
      <div className="lg:col-span-2 space-y-1">
        <div className="flex gap-2">
          <CustomInput className="font-bold" label="Từ khóa" />
        </div>
      </div>

      <DatePickerField label="Từ ngày" />
      <DatePickerField label="Đến ngày" />
    </GenericSearchFilter>
  );
};

export const DatePickerField = ({ label }: { label: string }) => {
  return (
    <div className="lg:col-span-1 space-y-1">
      <CustomDatePicker className="font-bold" label={label} />
    </div>
  );
};
