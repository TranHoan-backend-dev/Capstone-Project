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
        size="md"
        variant="bordered"
        className="w-full md:w-[280px]"
        classNames={{
          inputWrapper: "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 h-10",
          label: "text-sm font-bold text-gray-700 dark:text-zinc-300"
        }}
      />
    </div>
  );
};