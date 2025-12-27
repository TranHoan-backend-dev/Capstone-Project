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
    buttonClassName = "bg-[#2a66e4] h-7 px-4 text-white font-bold",
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
                inputWrapper: `h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 focus-within:!border-blue-500 transition-all shadow-sm pr-1 ${props.classNames?.inputWrapper || ""}`,
                input: "text-[13px]",
            }}
        />
    );
};
