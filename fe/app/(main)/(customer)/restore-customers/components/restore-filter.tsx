"use client";

import React from "react";
import { Card, CardBody, Input, Select, SelectItem, Button, InputProps } from "@heroui/react";
import { SearchIcon } from "@/components/ui/Icons";
import { CheckIcon, XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";

interface FormFieldProps extends Partial<InputProps> {
    label: string;
    placeholder: string;
    className?: string;
}

const FormField = ({ label, placeholder, className, ...props }: FormFieldProps) => (
    <div className={`space-y-1 ${className}`}>
        <label className="text-[11px] font-black text-gray-400 ml-1 uppercase tracking-wider">{label}</label>
        <Input
            placeholder={placeholder}
            variant="faded"
            radius="md"
            size="md"
            classNames={{
                inputWrapper: "h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 focus-within:!border-blue-500 transition-all shadow-sm",
                input: "text-[13px]",
            }}
            {...props}
        />
    </div>
);

const ActionButton = ({
    text,
    icon,
    firstColor,
    secondColor,
    onClick,
}: {
    text: string;
    icon: React.ReactNode;
    firstColor: string;
    secondColor: string;
    onClick: () => void;
}) => (
    <Button
        size="sm"
        className={`px-5 h-9 text-[13px] font-bold text-white bg-[${firstColor}] hover:bg-[${secondColor}] transition-all rounded-lg shadow-sm`}
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
        <Card shadow="sm" className="border-none rounded-xl">
            <CardBody className="p-5">
                <div className="flex items-center gap-3 mb-5 text-[#2563eb]">
                    <SearchIcon size={18} />
                    <h2 className="text-base font-bold tracking-tight text-gray-800 uppercase">Khôi Phục Khách Hàng Hủy</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3">
                    <FormField
                        label="Mã KH"
                        placeholder="Nhập mã khách hàng"
                        endContent={<SearchIcon size={14} className="text-gray-400" />}
                    />
                    <FormField
                        label="Tên khách hàng"
                        placeholder="Nhập tên khách hàng"
                    />
                    <FormField
                        label="Số Điện Thoại"
                        placeholder="Nhập sđt"
                    />
                    <FormField
                        label="Địa Chỉ"
                        placeholder="Nhập địa chỉ"
                    />
                    <FormField
                        label="Lý Do Khôi Phục"
                        placeholder="Nhập lý do"
                        className="lg:col-span-2"
                    />
                    <div className="space-y-1">
                        <label className="text-[11px] font-black text-gray-400 ml-1 uppercase tracking-wider">Kỳ Khôi Phục</label>
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
                </div>

                <div className="flex gap-2 mt-6">
                    <ActionButton
                        text="Lưu"
                        icon={<CheckIcon className="w-4 h-4" />}
                        firstColor="#22c55e"
                        secondColor="#16a34a"
                        onClick={() => { }}
                    />
                    <ActionButton
                        text="Hủy"
                        icon={<XMarkIcon className="w-4 h-4" />}
                        firstColor="#ef4444"
                        secondColor="#dc2626"
                        onClick={() => { }}
                    />
                    <ActionButton
                        text="Lọc"
                        icon={<FunnelIcon className="w-4 h-4" />}
                        firstColor="#2563eb"
                        secondColor="#1e40af"
                        onClick={() => { }}
                    />
                </div>
            </CardBody>
        </Card>
    );
};
