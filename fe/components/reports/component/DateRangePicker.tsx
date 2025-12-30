"use client";

import { DatePicker } from "@heroui/react";
import { DateValue } from "@heroui/react";

interface DateRangePickerProps {
  fromDate: DateValue | null;
  toDate: DateValue | null;
  onFromDateChange: (date: DateValue | null) => void;
  onToDateChange: (date: DateValue | null) => void;
  className?: string;
}

export const DateRangePicker = ({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  className = "",
}: DateRangePickerProps) => {
  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="space-y-1">
          <DatePicker
            label="Từ ngày"
            labelPlacement="inside"
            value={fromDate}
            onChange={onFromDateChange}
            granularity="day"
            size="md"
            variant="bordered"
            className="w-full md:w-[280px]"
          // classNames={{
          //   inputWrapper: "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 h-10",
          //   label: "text-sm font-bold text-gray-700 dark:text-zinc-300"
          // }}
          />
        </div>

        <div className="space-y-1">
          <DatePicker
            label="Đến ngày"
            labelPlacement="outside"
            value={toDate}
            onChange={onToDateChange}
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
      </div>
    </div>
  );
};