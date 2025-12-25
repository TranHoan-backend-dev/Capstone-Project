"use client";

import React from "react";
import { Card, CardBody, Input, Select, SelectItem, Button } from "@heroui/react";
import { SearchIcon } from "@/components/ui/icons";

interface FilterSectionProps {
    branches: { label: string; value: string }[];
    areas: { label: string; value: string }[];
    districts: { label: string; value: string }[];
    wards: { label: string; value: string }[];
}

export const FilterSection = ({ branches, areas, districts, wards }: FilterSectionProps) => {
    return (
        <Card shadow="sm" className="border-none rounded-2xl">
            <CardBody className="p-5">
                <div className="flex items-center gap-3 mb-5 text-[#2563eb]">
                    <SearchIcon size={20} />
                    <h2 className="text-lg font-bold tracking-tight text-gray-800">Bộ lọc tìm kiếm</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
                    {[
                        { label: "Mã KH", placeholder: "Nhập mã khách hàng" },
                        { label: "Số hợp đồng", placeholder: "Nhập số hợp đồng" },
                        { label: "Mã đồng hồ", placeholder: "Nhập mã đồng hồ" },
                        { label: "Tên khách hàng", placeholder: "Nhập tên khách hàng" },
                        { label: "Số nhà", placeholder: "Nhập số nhà" },
                        { label: "Lộ trình ghi", placeholder: "Nhập lộ trình ghi" },
                        { label: "Tên đường", placeholder: "Nhập tên đường" },
                        { label: "MST", placeholder: "Nhập mã số thuế" },
                    ].map((field) => (
                        <div key={field.label} className="space-y-2">
                            <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">{field.label}</label>
                            <Input
                                aria-label={field.label}
                                placeholder={field.placeholder}
                                variant="faded"
                                radius="md"
                                size="md"
                                classNames={{
                                    inputWrapper: "border-gray-100 hover:border-blue-200 focus-within:!border-blue-500 transition-all h-10 shadow-sm bg-gray-50/30",
                                    input: "text-[14px]",
                                }}
                            />
                        </div>
                    ))}

                    {[
                        { label: "Chi nhánh", data: branches },
                        { label: "Khu vực", data: areas },
                        { label: "Quận/Huyện", data: districts },
                        { label: "Phường", data: wards },
                    ].map((field) => (
                        <div key={field.label} className="space-y-2">
                            <label className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">{field.label}</label>
                            <Select
                                aria-label={field.label}
                                defaultSelectedKeys={new Set(["all"])}
                                variant="faded"
                                radius="md"
                                size="md"
                                classNames={{
                                    trigger: "transition-all h-10 shadow-sm bg-gray-50/30",
                                    value: "text-[14px]",
                                }}
                            >
                                {field.data.map((item) => (
                                    <SelectItem key={item.value}>{item.label}</SelectItem>
                                ))}
                            </Select>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end mt-6">
                    <Button
                        color="primary"
                        className="px-10 py-5 text-[15px] font-bold bg-[#2563eb] hover:bg-blue-700 shadow-md shadow-blue-200"
                        size="md"
                    >
                        Lọc
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};
