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
            className="w-full"
            granularity="day"
            label="Từ ngày"
            labelPlacement="inside"
            size="md"
            value={fromDate}
            variant="bordered"
            onChange={onFromDateChange}
          />
        </div>

        <div className="space-y-1">
          <DatePicker
            className="w-full"
            granularity="day"
            label="Đến ngày"
            labelPlacement="inside"
            size="md"
            value={toDate}
            variant="bordered"
            onChange={onToDateChange}
          />
        </div>
      </div>
    </div>
  );
};
