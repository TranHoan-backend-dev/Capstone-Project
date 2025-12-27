"use client";

import React from "react";
import { Input, DatePicker } from "@heroui/react";
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
            <div className="md:col-span-4 space-y-1">
                <FilterLabel>Từ khóa tìm kiếm</FilterLabel>
                <Input
                    placeholder="Nhập mã đơn, tên khách hàng, số điện thoại..."
                    variant="faded"
                    radius="md"
                    size="md"
                    classNames={{
                        inputWrapper: "h-11 bg-gray-50/50 border-gray-100 focus-within:!border-blue-500 transition-all",
                    }}
                />
            </div>

            <div className="md:col-span-4 space-y-1">
                <FilterLabel>Mã vật tư</FilterLabel>
                <Input
                    placeholder="Nhập mã vật tư"
                    variant="faded"
                    radius="md"
                    size="md"
                    classNames={{
                        inputWrapper: "h-11 bg-gray-50/50 border-gray-100 focus-within:!border-blue-500 transition-all",
                    }}
                />
            </div>

            <div className="md:col-span-4 space-y-1">
                <FilterLabel>Tên đường</FilterLabel>
                <Input
                    placeholder="Nhập tên đường"
                    variant="faded"
                    radius="md"
                    size="md"
                    classNames={{
                        inputWrapper: "h-11 bg-gray-50/50 border-gray-100 focus-within:!border-blue-500 transition-all",
                    }}
                />
            </div>

            <div className="md:col-span-4 space-y-1">
                <FilterLabel>Từ ngày đăng ký</FilterLabel>
                <DatePicker
                    variant="faded"
                    radius="md"
                    size="md"
                    classNames={{
                        base: "h-11",
                        calendarContent: "bg-white",
                    }}
                />
            </div>

            <div className="md:col-span-4 space-y-1">
                <FilterLabel>Đến ngày đăng ký</FilterLabel>
                <DatePicker
                    variant="faded"
                    radius="md"
                    size="md"
                    classNames={{
                        base: "h-11",
                        calendarContent: "bg-white",
                    }}
                />
            </div>
        </GenericSearchFilter>
    );
};
