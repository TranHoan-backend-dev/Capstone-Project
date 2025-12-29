"use client";

import React from "react";
import { DatePicker, Input } from "@heroui/react";
import { SearchIcon } from "@/components/ui/Icons";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";

export const FilterSection = () => {
    return (
        <GenericSearchFilter
            title="Tra cứu dự toán"
            icon={<SearchIcon size={18} />}
            gridClassName="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4"
            isCollapsible
        >
            <InputField label="Từ khóa" />
            <DatePickerField label="Từ ngày" />
            <DatePickerField label="Đến ngày" />

            <InputField label="Mã vật tư" />
            <InputField label="Tên đường" />
        </GenericSearchFilter>

    );
};

export const DatePickerField = ({ label, colSpan = "md:col-span-4" }: { label: string; colSpan?: string }) => {
    return (
        <div className={`${colSpan} space-y-1`}>
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

export const InputField = ({ label, colSpan = "md:col-span-4" }: { label: string; colSpan?: string }) => {
    return (
        <div className={`${colSpan} space-y-1`}>
            <Input
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

