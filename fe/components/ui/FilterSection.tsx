"use client";

import React from "react";
import { DateValue } from "@heroui/react";

import CustomInput from "./custom/CustomInput";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";

interface FilterSectionProps {
  title?: string;
  onSearch?: (query: string) => void;
  keyword: string;
  from: DateValue | null | undefined;
  to: DateValue | null | undefined;
  setKeywordAction: (keyword: string) => void;
  setFromAction: (date: DateValue | null | undefined) => void;
  setToAction: (date: DateValue | null | undefined) => void;
  actions?: React.ReactNode;
}

export const FilterSection = ({
  title,
  onSearch,
  keyword,
  from,
  to,
  setKeywordAction,
  setFromAction,
  setToAction,
  actions,
}: FilterSectionProps) => {
  return (
    <GenericSearchFilter
      isCollapsible
      actions={actions}
      filterButtonLabel="Tìm"
      gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3"
      icon={<SearchIcon size={18} />}
      title={title || "Tra cứu đơn"}
      onFilter={() => {}} // Could trigger search here if preferred
    >
      <div className="lg:col-span-2 space-y-1">
        <div className="flex gap-2">
          <CustomInput
            className="font-bold"
            label="Nhập từ khóa tìm kiếm"
            value={keyword}
            onChange={(e) => {
              onSearch?.(e.target.value);
              setKeywordAction?.(e.target.value);
            }}
          />
        </div>
      </div>

      <DatePickerField
        label="Từ ngày"
        value={from}
        onDateChangeAction={setFromAction}
      />
      <DatePickerField
        label="Đến ngày"
        value={to}
        onDateChangeAction={setToAction}
      />
    </GenericSearchFilter>
  );
};

export const DatePickerField = ({
  label,
  value,
  onDateChangeAction,
}: {
  label: string;
  value: DateValue | null | undefined;
  onDateChangeAction: (date: DateValue | null | undefined) => void;
}) => {
  return (
    <div className="lg:col-span-1 space-y-1">
      <CustomDatePicker
        className="font-bold"
        label={label}
        value={value}
        onChange={(date) => onDateChangeAction?.(date)}
      />
    </div>
  );
};
