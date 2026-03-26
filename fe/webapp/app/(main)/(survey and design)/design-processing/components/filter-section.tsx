"use client";

import React from "react";

import { SearchIcon } from "@/components/ui/Icons";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import CustomInput from "@/components/ui/custom/CustomInput";
import { DateValue } from "@heroui/react";
import CustomButton from "@/components/ui/custom/CustomButton";

export const FilterSection = ({
  keyword,
  setKeywordAction,
  onSearch,
  from,
  to,
  setFromAction,
  setToAction,
}: {
  keyword: string;
  setKeywordAction: (val: string) => void;
  onSearch: () => void;

  from: DateValue | null | undefined;
  to: DateValue | null | undefined;
  setFromAction: (val: DateValue | null | undefined) => void;
  setToAction: (val: DateValue | null | undefined) => void;
}) => {
  return (
    <GenericSearchFilter
      isCollapsible
      gridClassName="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4"
      icon={<SearchIcon size={18} />}
      title="Tra cứu đơn"
      actions={
        <CustomButton
          onClick={onSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Lọc
        </CustomButton>
      }
    >
      <InputField
        label="Từ khóa"
        value={keyword}
        onChange={setKeywordAction}
        onEnter={onSearch}
      />

      <DatePickerField label="Từ ngày" value={from} onChange={setFromAction} />

      <DatePickerField label="Đến ngày" value={to} onChange={setToAction} />
    </GenericSearchFilter>
  );
};

export const DatePickerField = ({
  label,
  colSpan = "md:col-span-4",
  value,
  onChange,
}: {
  label: string;
  colSpan?: string;
  value?: DateValue | null;
  onChange?: (val: DateValue | null) => void;
}) => {
  return (
    <div className={`${colSpan} space-y-1`}>
      <CustomDatePicker
        className="font-bold"
        label={label}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export const InputField = ({
  label,
  colSpan = "md:col-span-4",
  value,
  onChange,
  onEnter,
}: {
  label: string;
  colSpan?: string;
  value?: string;
  onChange?: (val: string) => void;
  onEnter?: () => void;
}) => {
  return (
    <div className={`${colSpan} space-y-1`}>
      <CustomInput
        className="font-bold"
        label={label}
        value={value}
        onChange={(e: any) => onChange?.(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter") {
            onEnter?.();
          }
        }}
      />
    </div>
  );
};
