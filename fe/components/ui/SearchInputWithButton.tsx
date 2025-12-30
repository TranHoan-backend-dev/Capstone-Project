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
            variant="bordered"
            radius="md"
            size="md"
            {...props}
            endContent={
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className={`min-w-8 w-8 h-8 data-[hover=true]:bg-transparent ${buttonClassName}`}
                    onPress={onSearch}
                    endContent={<SearchIcon size={18} />}
                />
            }
        />
    );
};
