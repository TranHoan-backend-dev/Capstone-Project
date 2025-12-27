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
            gridClassName="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4"
            isCollapsible
        >
            <div className="md:col-span-6 space-y-1">
                <FilterLabel>Từ khóa</FilterLabel>
                <div className="flex gap-2">
                    <Input
                        placeholder="Nhập từ khóa tìm kiếm"
                        variant="faded"
                        radius="md"
                        size="md"
                        classNames={{
                            inputWrapper: "h-11 bg-gray-50/50 border-gray-100 focus-within:!border-blue-500 transition-all",
                        }}
                    />
                </div>
            </div>

            <div className="md:col-span-3 space-y-1">
                <FilterLabel>Từ ngày</FilterLabel>
                <DatePicker
                    variant="faded"
                    radius="md"
                    size="md"
                    className="max-w-full"
                    classNames={{
                        base: "h-11",
                        calendarContent: "bg-white",
                    }}
                />
            </div>

            <div className="md:col-span-3 space-y-1">
                <FilterLabel>Đến ngày</FilterLabel>
                <DatePicker
                    variant="faded"
                    radius="md"
                    size="md"
                    className="max-w-full"
                    classNames={{
                        base: "h-11",
                        calendarContent: "bg-white",
                    }}
                />
            </div>
        </GenericSearchFilter>
    );
};
