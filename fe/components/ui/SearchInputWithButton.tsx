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
    buttonClassName = "text-blue-600 hover:bg-blue-50",
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
                    isIconOnly
                    size="sm"
                    variant="light"
                    className={`min-w-8 w-8 h-8 ${buttonClassName}`}
                    onPress={onSearch}
                    endContent={<SearchIcon size={18} />}
                />
            }

            classNames={{
                ...props.classNames,
                inputWrapper: `h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 focus-within:!border-blue-500 transition-all shadow-sm pr-1 ${props.classNames?.inputWrapper || ""}`,
                input: "text-[13px]",
            }}
        />
    );
};
