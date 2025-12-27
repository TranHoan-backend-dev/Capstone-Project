"use client";

import React from "react";
import { Button, ButtonProps } from "@heroui/react";

interface FilterActionButtonProps extends ButtonProps {
    label: string;
    icon?: React.ReactNode;
}

export const FilterActionButton = ({
    label,
    icon,
    className = "",
    ...props
}: FilterActionButtonProps) => {
    const baseStyles = "px-5 h-9 text-[13px] font-bold border-none transition-all rounded-lg shadow-sm text-white";

    return (
        <Button
            size="sm"
            variant="solid"
            className={`${baseStyles} ${className}`}
            startContent={icon}
            {...props}
        >
            {label}
        </Button>
    );
};
