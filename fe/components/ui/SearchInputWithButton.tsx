"use client";

import React from "react";
import { Input, Button, InputProps } from "@heroui/react";

import { SearchIcon } from "./Icons";

interface SearchInputWithButtonProps extends Omit<InputProps, "endContent"> {
  onSearch?: () => void;
  buttonLabel?: string;
  buttonClassName?: string;
}

export const SearchInputWithButton = ({
  placeholder = "Tìm kiếm...",
  onSearch,
  buttonClassName = "text-primary",
  ...props
}: SearchInputWithButtonProps) => {
  return (
    <Input
      label={placeholder}
      radius="md"
      size="md"
      variant="bordered"
      {...props}
      endContent={
        <Button
          isIconOnly
          className={`min-w-8 w-8 h-8 data-[hover=true]:bg-transparent ${buttonClassName}`}
          endContent={<SearchIcon size={18} />}
          size="sm"
          variant="light"
          onPress={onSearch}
        />
      }
    />
  );
};
