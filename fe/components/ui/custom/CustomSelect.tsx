"use client";

import React from "react";
import { Select, SelectItem } from "@heroui/react";

export interface SelectOption {
  label: string;
  value: string;
}

interface BaseSelectProps {
  label: string;
  options: SelectOption[];
  selectedKeys?: Set<string>;
  defaultSelectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  className?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  props?: any;
}

const CustomSelect = ({
  label,
  options,
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  className,
  isDisabled = false,
  isRequired = false,
  ...props
}: BaseSelectProps) => {
  return (
    <Select
      aria-label={label}
      className={className}
      defaultSelectedKeys={defaultSelectedKeys}
      isDisabled={isDisabled}
      isRequired={isRequired}
      label={label}
      labelPlacement="inside"
      radius="md"
      selectedKeys={selectedKeys}
      size="md"
      variant="bordered"
      onSelectionChange={(keys) => onSelectionChange?.(keys as Set<string>)}
      {...props}
    >
      {options.map((item) => (
        <SelectItem key={item.value} textValue={item.label}>
          {item.label}
        </SelectItem>
      ))}
    </Select>
  );
};

export default CustomSelect;
