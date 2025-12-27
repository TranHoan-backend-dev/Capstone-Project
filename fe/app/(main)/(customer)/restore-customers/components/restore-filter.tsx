"use client";

import React from "react";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { SearchIcon } from "@/components/ui/Icons";
import { CheckIcon, XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { GenericSearchFilter, FilterLabel } from "@/components/ui/GenericSearchFilter";

import { FilterActionButton } from "@/components/ui/FilterActionButton";

interface RestoreFilterProps {
    periodData: { label: string; value: string }[];
}

export const RestoreFilter = ({ periodData }: RestoreFilterProps) => {
    return (
        <GenericSearchFilter
            title="Khôi Phục Khách Hàng Hủy"
            icon={<SearchIcon size={18} />}
            gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3"
            isCollapsible
            actions={
                <>
                    <FilterActionButton
                        label="Lưu"
                        icon={<CheckIcon className="w-4 h-4" />}
                        color="success"
                        className="bg-green-500 hover:bg-green-600"
                        onPress={() => { }}
                    />
                    <FilterActionButton
                        label="Hủy"
                        icon={<XMarkIcon className="w-4 h-4" />}
                        color="danger"
                        className="bg-red-500 hover:bg-red-600"
                        onPress={() => { }}
                    />
                    <FilterActionButton
                        label="Lọc"
                        icon={<FunnelIcon className="w-4 h-4" />}
                        color="primary"
                        className="bg-blue-600 hover:bg-blue-700"
                        onPress={() => { }}
                    />
                </>
            }
        >
            <InputField label="Mã KH" placeholder="Nhập mã khách hàng" />
            <InputField label="Tên khách hàng" placeholder="Nhập tên khách hàng" />
            <InputField label="Số Điện Thoại" placeholder="Nhập sđt" />
            <InputField label="Địa Chỉ" placeholder="Nhập địa chỉ" />
            <InputField label="Lý Do Khôi Phục" placeholder="Nhập lý do" />
            <div className="space-y-1">
                <FilterLabel>Kỳ Khôi Phục</FilterLabel>
                <Select
                    defaultSelectedKeys={["T8/2025"]}
                    variant="faded"
                    radius="md"
                    size="md"
                    classNames={{
                        trigger: "h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 transition-all shadow-sm",
                        value: "text-[13px]",
                    }}
                >
                    {periodData.map((item) => (
                        <SelectItem key={item.value} textValue={item.label}>{item.label}</SelectItem>
                    ))}
                </Select>
            </div>
        </GenericSearchFilter>
    );
};

export const InputField = ({ label, placeholder }: { label: string, placeholder: string }) => {
    return (
        <div className="space-y-1 lg:col-span-2">
            <FilterLabel>{label}</FilterLabel>
            <Input
                placeholder={placeholder}
                variant="faded"
                radius="md"
                size="md"
                classNames={{
                    inputWrapper: "h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 focus-within:!border-blue-500 transition-all shadow-sm",
                    input: "text-[13px]",
                }}
            />
        </div>
    );
}
