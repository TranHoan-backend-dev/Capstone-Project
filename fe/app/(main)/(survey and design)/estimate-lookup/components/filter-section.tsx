"use client";

import React from "react";
import { DatePicker, Input } from "@heroui/react";
import { SearchIcon } from "@/components/ui/Icons";
import { GenericSearchFilter, FilterLabel } from "@/components/ui/GenericSearchFilter";

export const FilterSection = () => {
    return (
        <GenericSearchFilter
            title="Bộ lọc tìm kiếm"
            icon={<SearchIcon size={18} />}
            gridClassName="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6"
            isCollapsible
        >
            <InputField label="Từ khóa tìm kiếm" placeholder="Nhập mã đơn, tên khách hàng, số điện thoại..." />
            <InputField label="Mã vật tư" placeholder="Nhập mã vật tư" />
            <InputField label="Tên đường" placeholder="Nhập tên đường" />

            <DatePickerField label="Từ ngày đăng ký" />
            <DatePickerField label="Đến ngày đăng ký" />
        </GenericSearchFilter>
    );
};

export const DatePickerField = ({ label }: { label: string }) => {
    return (
        <div className="md:col-span-4 space-y-1">
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

export const InputField = ({ label, placeholder }: { label: string; placeholder: string }) => {
    return (
        <div className="md:col-span-4 space-y-1">
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
