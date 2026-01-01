"use client";

import React from "react";
import { DatePicker, DateValue } from "@heroui/react";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "./CustomInput";

interface FilterSectionProps {
    title?: string;
    onSearch?: (query: string) => void;
    keyword: string;
    from: DateValue | null | undefined;
    to: DateValue | null | undefined;
    setKeyword: (keyword: string) => void;
    setFrom: (date: DateValue | null | undefined) => void;
    setTo: (date: DateValue | null | undefined) => void;
    actions?: React.ReactNode;
}

export const FilterSection = ({ title, onSearch, keyword, from, to, setKeyword, setFrom, setTo, actions }: FilterSectionProps) => {
    return (
        <GenericSearchFilter
            actions={actions}
            title={title || "Tra cứu đơn"}
            icon={<SearchIcon size={18} />}
            gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3"
            isCollapsible
            filterButtonLabel="Tìm"
            onFilter={() => { }} // Could trigger search here if preferred
        >
            <div className="lg:col-span-2 space-y-1">
                <div className="flex gap-2">
                    <CustomInput
                        value={keyword}
                        label="Nhập từ khóa tìm kiếm"
                        className="font-bold"
                        onChange={(e) => { onSearch?.(e.target.value); setKeyword?.(e.target.value) }}
                    />
                </div>
            </div>

            <DatePickerField label="Từ ngày" value={from} onDateChange={setFrom} />
            <DatePickerField label="Đến ngày" value={to} onDateChange={setTo} />
        </GenericSearchFilter>
    );
};

export const DatePickerField = ({ label, value, onDateChange }: { label: string, value: DateValue | null | undefined, onDateChange: (date: DateValue | null | undefined) => void }) => {
    return (
        <div className="lg:col-span-1 space-y-1">
            <DatePicker
                label={label}
                variant="bordered"
                radius="md"
                size="md"
                value={value}
                className="font-bold"
                onChange={(date) => onDateChange?.(date)}
            />
        </div>
    );
}
