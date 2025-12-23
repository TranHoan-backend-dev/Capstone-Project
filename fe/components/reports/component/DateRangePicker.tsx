// components/filters/DateRangePicker.tsx
import { DatePicker } from "@heroui/date-picker";
import { DateValue } from "@heroui/react";
import Label from "@/components/ui/Label";

interface DateRangePickerProps {
  fromDate: DateValue | null;
  toDate: DateValue | null;
  onFromDateChange: (date: DateValue | null) => void;
  onToDateChange: (date: DateValue | null) => void;
  className?: string;
}

export function DateRangePicker({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  className = "",
}: DateRangePickerProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="space-y-1">
          <Label className="text-sm">Từ ngày</Label>
          <DatePicker
            value={fromDate}
            onChange={onFromDateChange}
            granularity="day"
            size="sm"
            className="w-full md:w-[200px] rounded-md border border-gray-300 bg-white"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-sm">Đến ngày</Label>
          <DatePicker
            value={toDate}
            onChange={onToDateChange}
            granularity="day"
            size="sm"
            className="w-full md:w-[200px] rounded-md border border-gray-300 bg-white"
          />
        </div>
      </div>
    </div>
  );
}