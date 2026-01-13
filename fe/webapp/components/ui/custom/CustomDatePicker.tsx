"use client";

import React from "react";
import { DatePicker, DateValue } from "@heroui/react";

interface CustomDatePickerProps {
  label: string;
  value?: DateValue | null;
  onChange?: (date: DateValue | null) => void;
  isDisabled?: boolean;
  className?: string;
  isRequired?: boolean;
  props?: any;
}

const CustomDatePicker = ({
  label,
  value,
  onChange,
  isDisabled = false,
  isRequired = false,
  className,
  ...props
}: CustomDatePickerProps) => {
  return (
    <div className="space-y-1">
      <DatePicker
        aria-label={label}
        className={className}
        isDisabled={isDisabled}
        isRequired={isRequired}
        label={label}
        labelPlacement="inside"
        radius="md"
        size="md"
        value={value}
        variant="bordered"
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default CustomDatePicker;
