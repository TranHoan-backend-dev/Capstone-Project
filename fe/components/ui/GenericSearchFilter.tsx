"use client";

import React from "react";
import { Card, CardBody, Button, ButtonProps } from "@heroui/react";
import { FunnelIcon } from "@heroicons/react/24/outline";

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
}: GenericSearchFilterProps) => {
    return (
        <Card shadow="sm" className="border-none rounded-xl bg-white">
            <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-6 text-blue-600">
                    {icon}
                    <h2 className="text-lg font-bold tracking-tight text-gray-800">{title}</h2>
                </div>

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
            </CardBody>
        </Card>
    );
};
