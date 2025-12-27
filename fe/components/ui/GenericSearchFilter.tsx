"use client";

import React from "react";
import { Card, CardBody, Button, ButtonProps } from "@heroui/react";
import { FunnelIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export const FilterLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[11px] font-semibold ml-1 uppercase tracking-wider block mb-1">
        {children}
    </label>
);

interface GenericSearchFilterProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    onFilter?: () => void;
    filterButtonLabel?: string;
    filterButtonProps?: ButtonProps;
    gridClassName?: string;
    actions?: React.ReactNode;
    isCollapsible?: boolean;
    defaultOpen?: boolean;
}

export const GenericSearchFilter = ({
    title,
    icon,
    children,
    onFilter,
    filterButtonLabel = "Lọc",
    filterButtonProps,
    gridClassName = "grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6",
    actions,
    isCollapsible = false,
    defaultOpen = true,
}: GenericSearchFilterProps) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    return (
        <Card shadow="sm" className="border-none rounded-xl bg-white overflow-hidden transition-all duration-300">
            <CardBody className="p-0">
                <div
                    role={isCollapsible ? "button" : undefined}
                    onClick={() => isCollapsible && setIsOpen(!isOpen)}
                    className={`p-6 flex items-center justify-between transition-colors ${isCollapsible ? "cursor-pointer select-none hover:bg-gray-50/50" : ""}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="text-blue-600">
                            {icon}
                        </div>
                        <h2 className="text-lg font-bold tracking-tight text-gray-800">{title}</h2>
                    </div>
                    {isCollapsible && (
                        <div className="text-gray-400">
                            <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                        </div>
                    )}
                </div>

                <div className={`px-6 pb-6 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "opacity-100 max-h-[2000px] visible" : "opacity-0 max-h-0 invisible"}`}>
                    <div className={gridClassName}>
                        {children}
                    </div>

                    <div className="flex justify-end mt-8 gap-2">
                        {actions ? actions : (
                            <Button
                                color="primary"
                                startContent={<FunnelIcon className="w-4 h-4" />}
                                className="px-8 h-11 text-sm font-bold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100 rounded-lg"
                                onPress={onFilter}
                                {...filterButtonProps}
                            >
                                {filterButtonLabel}
                            </Button>
                        )}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
