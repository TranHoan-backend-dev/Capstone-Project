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
        labelPlacement="inside"
        value={value}
        onChange={onChange}
        granularity="day"
        size="md"
        variant="bordered"
        className="w-full"
      />
    </div>
  );
};