"use client";

import React from "react";
import { Select, SelectItem } from "@heroui/react";
import { Role, ROLE_META } from "@/types";

interface RoleSelectProps {
  value?: Role;
  onChange: (role: Role) => void;
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
  required?: boolean;
}

export const RoleSelect = ({
  value,
  onChange,
  label = "Vai trò",
  placeholder = "Chọn vai trò",
  isDisabled = false,
  required = false,
}: RoleSelectProps) => {
  const roles = Object.entries(ROLE_META).map(([key, meta]) => ({
    key: key as Role,
    label: meta.label,
  }));

  return (
    <Select
      label={label}
      placeholder={placeholder}
      selectedKeys={value ? [value] : []}
      onChange={(e) => onChange(e.target.value as Role)}
      isDisabled={isDisabled}
      required={required}
    >
      {roles.map((role) => (
        <SelectItem key={role.key}>{role.label}</SelectItem>
      ))}
    </Select>
  );
};
