"use client";

import React from "react";
import { Input, Select, SelectItem } from "@heroui/react";
import { SearchIcon } from "@/components/ui/Icons";
import { GenericSearchFilter, FilterLabel } from "@/components/ui/GenericSearchFilter";

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
        <GenericSearchFilter
            title="Bộ lọc tìm kiếm"
            icon={<SearchIcon size={18} />}
            gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4"
        >
            {inputFields.map((field) => (
                <div key={field.label} className="space-y-1">
                    <FilterLabel>{field.label}</FilterLabel>
                    <Input
                        placeholder={field.placeholder}
                        variant="faded"
                        radius="md"
                        size="md"
                        classNames={{
                            inputWrapper: "h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 focus-within:!border-blue-500 transition-all shadow-sm",
                            input: "text-[13px]",
                        }}
                    />
                </div>
            ))}

            {selectFields.map((field) => (
                <div key={field.label} className="space-y-1">
                    <FilterLabel>{field.label}</FilterLabel>
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
        </GenericSearchFilter>
    );
};
