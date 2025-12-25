"use client";

import { DatePicker } from "@heroui/react";
import { DateValue } from "@heroui/react";

interface SingleDatePickerProps {
  value: DateValue | null;
  onChange: (date: DateValue | null) => void;
  label?: string;
  className?: string;
}

export const SingleDatePicker = ({
  value,
  onChange,
  label = "Ngày lập",
  className = "",
}: SingleDatePickerProps) => {
  return (
    <div className={`${className}`}>
      <DatePicker
        label={label}
        labelPlacement="outside"
        value={value}
        onChange={onChange}
        granularity="day"
        size="sm"
        className="w-full md:w-[200px] rounded-md border border-gray-300 bg-white"
      />
    </div>
  );
};