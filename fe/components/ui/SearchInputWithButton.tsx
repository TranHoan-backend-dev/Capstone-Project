"use client";

import React from "react";
import { Input, Button, InputProps } from "@heroui/react";

import { SearchIcon } from "./Icons";
import {TitleDarkColor} from "@/config/chip-and-icon";

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
      labelPlacement="inside"
      {...props}
      endContent={
        <Button
          isIconOnly
          className={`min-w-8 w-8 h-8 data-[hover=true]:bg-transparent ${buttonClassName}`}
          endContent={<SearchIcon className={TitleDarkColor} size={18} />}
          size="sm"
          variant="light"
          onPress={onSearch}
        />
      }
    />
  );
};
