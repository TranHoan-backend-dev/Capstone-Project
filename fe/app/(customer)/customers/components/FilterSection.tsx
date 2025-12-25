"use client";

import React from "react";
import { Card, CardBody, Input, Select, SelectItem, Button, InputProps } from "@heroui/react";
import { SearchIcon } from "@/components/ui/icons";

interface FormFieldProps extends Partial<InputProps> {
    label: string;
    placeholder: string;
}

const FormField = ({ label, placeholder, ...props }: FormFieldProps) => (
    <div className="space-y-1">
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

interface FilterSectionProps {
    branches: { label: string; value: string }[];
    areas: { label: string; value: string }[];
    districts: { label: string; value: string }[];
    wards: { label: string; value: string }[];
}

export const FilterSection = ({ branches, areas, districts, wards }: FilterSectionProps) => {
    const inputFields = [
        { label: "Mã KH", placeholder: "Nhập mã khách hàng" },
        { label: "Số hợp đồng", placeholder: "Nhập số hợp đồng" },
        { label: "Mã đồng hồ", placeholder: "Nhập mã đồng hồ" },
        { label: "Tên khách hàng", placeholder: "Nhập tên khách hàng" },
        { label: "Số nhà", placeholder: "Nhập số nhà" },
        { label: "Lộ trình ghi", placeholder: "Nhập lộ trình ghi" },
        { label: "Tên đường", placeholder: "Nhập tên đường" },
        { label: "MST", placeholder: "Nhập mã số thuế" },
    ];

    const selectFields = [
        { label: "Chi nhánh", data: branches },
        { label: "Khu vực", data: areas },
        { label: "Quận/Huyện", data: districts },
        { label: "Phường", data: wards },
    ];

    return (
        <Card shadow="sm" className="border-none rounded-xl">
            <CardBody className="p-5">
                <div className="flex items-center gap-3 mb-5 text-[#2563eb]">
                    <SearchIcon size={18} />
                    <h2 className="text-base font-bold tracking-tight text-gray-800">Bộ lọc tìm kiếm</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4">
                    {inputFields.map((field) => (
                        <FormField key={field.label} label={field.label} placeholder={field.placeholder} />
                    ))}

                    {selectFields.map((field) => (
                        <div key={field.label} className="space-y-1">
                            <label className="text-[11px] font-black text-gray-400 ml-1 uppercase tracking-wider">{field.label}</label>
                            <Select
                                aria-label={field.label}
                                defaultSelectedKeys={new Set(["all"])}
                                variant="faded"
                                radius="md"
                                size="md"
                                classNames={{
                                    trigger: "h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 transition-all shadow-sm",
                                    value: "text-[13px]",
                                }}
                            >
                                {field.data.map((item) => (
                                    <SelectItem key={item.value} textValue={item.label}>{item.label}</SelectItem>
                                ))}
                            </Select>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end mt-6">
                    <Button
                        color="primary"
                        className="px-10 h-10 text-[14px] font-bold bg-[#2563eb] hover:bg-blue-700 shadow-md shadow-blue-100 rounded-lg"
                    >
                        Lọc
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};
