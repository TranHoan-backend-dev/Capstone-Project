"use client";

import React from "react";
import { DatePicker, DateValue } from "@heroui/react";

interface CustomDatePickerProps {
  label: string;
  value?: DateValue;
  onChange?: (date: DateValue | null) => void;
  isDisabled?: boolean;
  className?: string;
  isRequired?: boolean;
  props?: any;
}

const CustomSingleDatePicker = ({
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
        label={label}
        labelPlacement="inside"
        variant="bordered"
        radius="md"
        size="md"
        value={value}
        onChange={onChange}
        isDisabled={isDisabled}
        isRequired={isRequired}
        className={className}
        {...props}
      />
    </div>
  );
};

export default CustomSingleDatePicker;
