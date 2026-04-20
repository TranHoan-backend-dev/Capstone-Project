"use client";

import { Input, InputProps } from "@heroui/react";
import React from "react";
import { focusNextFieldOnEnter } from "@/utils/focusNextFieldOnEnter";

interface CustomInputProps extends InputProps {
  type?: string;
  label: string;
  isLoading?: boolean;
}

const CustomInput = ({
  type = "text",
  label,
  isRequired,
  className = "",
  onKeyDown,
  errorMessage,
  ...props
}: CustomInputProps) => {
  return (
    <Input
      isRequired={isRequired}
      label={label}
      labelPlacement="inside"
      radius="md"
      size="md"
      type={type}
      variant="bordered"
      className={`w-full ${className}`}
      errorMessage={errorMessage || undefined}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (!e.defaultPrevented) {
          focusNextFieldOnEnter(
            e as React.KeyboardEvent<
              HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >,
          );
        }
      }}
      {...props}
    />
  );
};

export default CustomInput;
