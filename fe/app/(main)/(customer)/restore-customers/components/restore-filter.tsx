"use client";

import React from "react";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { SearchIcon } from "@/components/ui/Icons";
import { CheckIcon, XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { GenericSearchFilter, FilterLabel } from "@/components/ui/GenericSearchFilter";

const ActionButton = ({
    text,
    icon,
    className,
    onClick,
}: {
    text: string;
    icon: React.ReactNode;
    className: string;
    onClick: () => void;
}) => (
    <Button
        size="sm"
        className={`px-5 h-9 text-[13px] font-bold text-white transition-all rounded-lg shadow-sm ${className}`}
        startContent={icon}
        onPress={onClick}
    >
        {text}
    </Button>
);

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
                    <ActionButton
                        text="Lưu"
                        icon={<CheckIcon className="w-4 h-4" />}
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => { }}
                    />
                    <ActionButton
                        text="Hủy"
                        icon={<XMarkIcon className="w-4 h-4" />}
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => { }}
                    />
                    <ActionButton
                        text="Lọc"
                        icon={<FunnelIcon className="w-4 h-4" />}
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => { }}
                    />
                </>
            }
        >
            <div className="space-y-1">
                <FilterLabel>Mã KH</FilterLabel>
                <Input
                    placeholder="Nhập mã khách hàng"
                    variant="faded"
                    radius="md"
                    size="md"
                    endContent={<SearchIcon size={14} className="text-gray-400" />}
                    classNames={{
                        inputWrapper: "h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 focus-within:!border-blue-500 transition-all shadow-sm",
                        input: "text-[13px]",
                    }}
                />
            </div>
            <div className="space-y-1">
                <FilterLabel>Tên khách hàng</FilterLabel>
                <Input
                    placeholder="Nhập tên khách hàng"
                    variant="faded"
                    radius="md"
                    size="md"
                    classNames={{
                        inputWrapper: "h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 focus-within:!border-blue-500 transition-all shadow-sm",
                        input: "text-[13px]",
                    }}
                />
            </div>
            <div className="space-y-1">
                <FilterLabel>Số Điện Thoại</FilterLabel>
                <Input
                    placeholder="Nhập sđt"
                    variant="faded"
                    radius="md"
                    size="md"
                    classNames={{
                        inputWrapper: "h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 focus-within:!border-blue-500 transition-all shadow-sm",
                        input: "text-[13px]",
                    }}
                />
            </div>
            <div className="space-y-1">
                <FilterLabel>Địa Chỉ</FilterLabel>
                <Input
                    placeholder="Nhập địa chỉ"
                    variant="faded"
                    radius="md"
                    size="md"
                    classNames={{
                        inputWrapper: "h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 focus-within:!border-blue-500 transition-all shadow-sm",
                        input: "text-[13px]",
                    }}
                />
            </div>
            <div className="space-y-1 lg:col-span-2">
                <FilterLabel>Lý Do Khôi Phục</FilterLabel>
                <Input
                    placeholder="Nhập lý do"
                    variant="faded"
                    radius="md"
                    size="md"
                    classNames={{
                        inputWrapper: "h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 focus-within:!border-blue-500 transition-all shadow-sm",
                        input: "text-[13px]",
                    }}
                />
            </div>
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
