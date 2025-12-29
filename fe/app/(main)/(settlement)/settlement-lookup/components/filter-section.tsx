"use client";

import React from "react";
import { Input, DatePicker } from "@heroui/react";
import { GenericSearchFilter, FilterLabel } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";

export const FilterSection = () => {
    return (
        <GenericSearchFilter
            title="Tra cứu quyết toán"
            icon={<SearchIcon size={18} />}
            gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3"
            isCollapsible
        >
            <div className="lg:col-span-2 space-y-1">
                <div className="flex gap-2">
                    <Input
                        label="Từ khóa"
                        labelPlacement="inside"
                        variant="bordered"
                        radius="md"
                        size="md"
                        className="font-bold"
                    />
                </div>
            </div>

            <DatePickerField label="Từ ngày" />
            <DatePickerField label="Đến ngày" />
        </GenericSearchFilter>
    );
};

export const DatePickerField = ({ label }: { label: string }) => {
    return (
        <div className="lg:col-span-1 space-y-1">
            <DatePicker
                label={label}
                labelPlacement="inside"
                variant="bordered"
                radius="md"
                size="md"
                className="font-bold"
            />
        </div>
    );
}
