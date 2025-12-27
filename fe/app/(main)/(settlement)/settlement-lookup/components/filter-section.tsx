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
                <FilterLabel>Từ khóa</FilterLabel>
                <div className="flex gap-2">
                    <Input
                        placeholder="Nhập từ khóa tìm kiếm"
                        variant="faded"
                        radius="md"
                        size="md"
                        classNames={{
                            inputWrapper: "h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 focus-within:!border-blue-500 transition-all shadow-sm",
                            input: "text-[13px]",
                        }}
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
            <FilterLabel>{label}</FilterLabel>
            <DatePicker
                variant="faded"
                radius="md"
                size="md"
                classNames={{
                    base: "h-9 min-h-9",
                    calendarContent: "bg-white",
                    selectorButton: "h-9 w-9",
                    inputWrapper: "h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 focus-within:!border-blue-500 transition-all shadow-sm",
                    input: "text-[13px]",
                }}
            />
        </div>
    );
}
