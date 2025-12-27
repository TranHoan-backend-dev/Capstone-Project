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
    buttonLabel = "Tìm",
    buttonClassName = "bg-[#2a66e4] h-8 px-4 text-white",
    ...props
}: SearchInputWithButtonProps) => {
    return (
        <Input
            placeholder={placeholder}
            variant="faded"
            radius="md"
            size="md"
            {...props}
            endContent={
                <Button
                    size="sm"
                    color="primary"
                    className={buttonClassName}
                    startContent={<SearchIcon size={16} />}
                    onPress={onSearch}
                >
                    {buttonLabel}
                </Button>
            }
            classNames={{
                ...props.classNames,
                inputWrapper: `h-11 bg-gray-50/50 border-gray-100 focus-within:!border-blue-500 transition-all pr-1 ${props.classNames?.inputWrapper || ""}`,
            }}
        />
    );
};
