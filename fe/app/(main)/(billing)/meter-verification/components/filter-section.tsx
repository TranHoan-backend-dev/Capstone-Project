"use client";

import React from "react";
import { Input, Button, DatePicker, Select, SelectItem } from "@heroui/react";
import { FunnelIcon, TrashIcon } from "@heroicons/react/24/outline";
import { GenericSearchFilter, FilterLabel } from "@/components/ui/GenericSearchFilter";

export const FilterSection = () => {
    return (
        <GenericSearchFilter
            title=""
            gridClassName="grid grid-cols-1 md:grid-cols-4 gap-6"
            actions={
                <div className="flex gap-2">
                    <Button
                        color="primary"
                        startContent={<FunnelIcon className="w-4 h-4" />}
                        className="px-8 h-10 text-sm font-bold bg-[#2266db] hover:bg-blue-700 rounded-md"
                    >
                        Lọc
                    </Button>
                    <Button
                        className="px-4 h-10 text-sm font-bold bg-[#ff4d4f] text-white hover:bg-red-600 rounded-md"
                        startContent={<TrashIcon className="w-4 h-4" />}
                    >
                        Xóa toàn bộ lựa chọn
                    </Button>
                </div>
            }
        >
            <div className="space-y-1">
                <FilterLabel>Kỳ hóa đơn</FilterLabel>
                <Input
                    placeholder="Nhập kỳ HĐ"
                    variant="bordered"
                    radius="md"
                    size="md"
                    classNames={{
                        inputWrapper: "h-9 min-h-9 border-gray-200 bg-white",
                        input: "text-sm",
                    }}
                />
            </div>
            <div className="space-y-1">
                <FilterLabel>Ngày ghi</FilterLabel>
                <DatePicker
                    variant="bordered"
                    radius="md"
                    size="md"
                    classNames={{
                        inputWrapper: "h-9 min-h-9 border-gray-200 bg-white",
                    }}
                />
            </div>
            <div className="space-y-1">
                <FilterLabel>Mã khách hàng</FilterLabel>
                <Input
                    placeholder="Nhập mã KH"
                    variant="bordered"
                    radius="md"
                    size="md"
                    classNames={{
                        inputWrapper: "h-9 min-h-9 border-gray-200 bg-white",
                        input: "text-sm",
                    }}
                />
            </div>
            <div className="space-y-1">
                <FilterLabel>Số ghi</FilterLabel>
                <Input
                    placeholder="Nhập số ghi"
                    variant="bordered"
                    radius="md"
                    size="md"
                    classNames={{
                        inputWrapper: "h-9 min-h-9 border-gray-200 bg-white",
                        input: "text-sm",
                    }}
                />
            </div>

            <div className="space-y-1">
                <FilterLabel>Chi nhánh</FilterLabel>
                <Select
                    placeholder="Chọn chi nhánh"
                    variant="bordered"
                    radius="md"
                    size="md"
                    classNames={{
                        trigger: "h-9 min-h-9 border-gray-200 bg-white",
                        value: "text-sm",
                    }}
                >
                    <SelectItem key="1">Chi nhánh 1</SelectItem>
                </Select>
            </div>
            <div className="space-y-1">
                <FilterLabel>Trạng thái cúp</FilterLabel>
                <Select
                    placeholder="Chọn thông tin"
                    variant="bordered"
                    radius="md"
                    size="md"
                    classNames={{
                        trigger: "h-9 min-h-9 border-gray-200 bg-white",
                        value: "text-sm",
                    }}
                >
                    <SelectItem key="1">Tất cả</SelectItem>
                </Select>
            </div>
            <div className="space-y-1">
                <FilterLabel>Thông tin đồng hồ</FilterLabel>
                <Select
                    placeholder="Chọn thông tin"
                    variant="bordered"
                    radius="md"
                    size="md"
                    classNames={{
                        trigger: "h-9 min-h-9 border-gray-200 bg-white",
                        value: "text-sm",
                    }}
                >
                    <SelectItem key="1">Tất cả</SelectItem>
                </Select>
            </div>
            <div className="space-y-1">
                <FilterLabel>Thông tin ghi chỉ số</FilterLabel>
                <Select
                    placeholder="Chọn trạng thái"
                    variant="bordered"
                    radius="md"
                    size="md"
                    classNames={{
                        trigger: "h-9 min-h-9 border-gray-200 bg-white",
                        value: "text-sm",
                    }}
                >
                    <SelectItem key="1">Tất cả</SelectItem>
                </Select>
            </div>
        </GenericSearchFilter>
    );
};
