"use client";

import { DatePicker } from "@heroui/react";
import { DateValue } from "@heroui/react";

interface SingleDatePickerProps {
  value: DateValue | null;
  onChangeAction: (date: DateValue | null) => void;
  label?: string;
  className?: string;
}

export const SingleDatePicker = ({
  value,
  onChangeAction,
  label = "Ngày lập",
  className = "",
}: SingleDatePickerProps) => {
  return (
    <div className={`${className}`}>
      <DatePicker
        className="w-full"
        granularity="day"
        label={label}
        labelPlacement="inside"
        size="md"
        value={value}
        variant="bordered"
        onChange={onChangeAction}
      />
    </div>
  );
};
