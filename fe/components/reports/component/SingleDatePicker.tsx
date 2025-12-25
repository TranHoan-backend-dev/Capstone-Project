// components/filters/SingleDatePicker.tsx
import { DatePicker } from "@heroui/react";
import { DateValue } from "@heroui/react";
import Label from "@/components/ui/Label";

interface SingleDatePickerProps {
  value: DateValue | null;
  onChange: (date: DateValue | null) => void;
  label?: string;
  className?: string;
}

export function SingleDatePicker({
  value,
  onChange,
  label = "Ngày lập",
  className = "",
}: SingleDatePickerProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      <DatePicker
        value={value}
        onChange={onChange}
        granularity="day"
        size="sm"
        className="w-full md:w-[200px] rounded-md border border-gray-300 bg-white"
      />
    </div>
  );
}