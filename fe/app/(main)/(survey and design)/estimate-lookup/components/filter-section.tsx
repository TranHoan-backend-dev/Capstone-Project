"use client";

import React from "react";
import { DatePicker, Input } from "@heroui/react";
import { SearchIcon } from "@/components/ui/Icons";
import { GenericSearchFilter, FilterLabel } from "@/components/ui/GenericSearchFilter";

export const FilterSection = () => {
    return (
        <GenericSearchFilter
            title="Tra cứu dự toán"
            icon={<SearchIcon size={18} />}
            gridClassName="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6"
            isCollapsible
        >
            <InputField label="Từ khóa" placeholder="Nhập từ khóa tìm kiếm" colSpan="md:col-span-6" />
            <DatePickerField label="Từ ngày" colSpan="md:col-span-3" />
            <DatePickerField label="Đến ngày" colSpan="md:col-span-3" />

            <InputField label="Mã vật tư" placeholder="Nhập mã vật tư" colSpan="md:col-span-6" />
            <InputField label="Tên đường" placeholder="Nhập tên đường" colSpan="md:col-span-6" />
        </GenericSearchFilter>

    );
};

export const DatePickerField = ({ label, colSpan = "md:col-span-4" }: { label: string; colSpan?: string }) => {
    return (
        <div className={`${colSpan} space-y-1`}>
            <FilterLabel>{label}</FilterLabel>
            <DatePicker
                variant="faded"
                radius="md"
                size="md"
                classNames={{
                    base: "h-9 min-h-9",
                    calendarContent: "bg-white",
                }}
            />
        </div>
    );
}

export const InputField = ({ label, placeholder, colSpan = "md:col-span-4" }: { label: string; placeholder: string; colSpan?: string }) => {
    return (
        <div className={`${colSpan} space-y-1`}>
            <FilterLabel>{label}</FilterLabel>
            <Input
                placeholder={placeholder}
                variant="faded"
                radius="md"
                size="md"
                classNames={{
                    inputWrapper: "h-9 min-h-9 bg-gray-50/50 border-gray-100 focus-within:!border-blue-500 transition-all",
                }}
            />
        </div>
    );
}

