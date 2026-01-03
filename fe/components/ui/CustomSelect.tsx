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
}

const CustomSelect = ({
  label,
  options,
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  className,
  isDisabled = false,
}: BaseSelectProps) => {
  return (
    <Select
      aria-label={label}
      label={label}
      labelPlacement="inside"
      variant="bordered"
      radius="md"
      size="md"
      className={`font-bold ${className ?? ""}`}
      selectedKeys={selectedKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      onSelectionChange={(keys) =>
        onSelectionChange?.(keys as Set<string>)
      }
      isDisabled={isDisabled}
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
