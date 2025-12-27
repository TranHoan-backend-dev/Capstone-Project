"use client";

import React, { useState } from "react";
import { Input, Select, SelectItem, Button, DatePicker } from "@heroui/react";
import { SearchIcon } from "@/components/ui/Icons";
import { TrashIcon, CheckCircleIcon, XCircleIcon, ClockIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { GenericSearchFilter, FilterLabel } from "@/components/ui/GenericSearchFilter";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { FilterActionButton } from "@/components/ui/FilterActionButton";

export const FilterSection = () => {
    const [status, setStatus] = useState<"approved" | "rejected" | "pending">("approved");

    const branches = [
        { label: "Thành phố Nam Định", value: "nam_dinh" },
    ];

    const totalBranches = [
        { label: "Tất cả", value: "all" },
    ];

    return (
        <GenericSearchFilter
            title="Xử lí đơn chờ thiết kế & Thiết kế"
            icon={<SearchIcon size={18} />}
            gridClassName="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4"
            isCollapsible
            actions={
                <FilterActionButton
                    label="Xóa toàn bộ lựa chọn"
                    icon={<TrashIcon className="w-4 h-4" />}
                    className="bg-gray-100 text-gray-700 font-bold px-6 shadow-none border border-gray-200"
                />
            }
        >
            {/* Row 1 */}
            <div className="md:col-span-6 space-y-1">
                <FilterLabel>Ngày duyệt đơn</FilterLabel>
                <DatePicker
                    variant="faded"
                    radius="md"
                    size="md"
                    className="max-w-full"
                    classNames={{
                        base: "h-11",
                        calendarContent: "bg-white",
                    }}
                />
            </div>

            <div className="md:col-span-6 space-y-1">
                <FilterLabel>Trạng thái</FilterLabel>
                <div className="flex gap-2">
                    <FilterActionButton
                        label="Duyệt đơn"
                        icon={<CheckCircleIcon className="w-4 h-4" />}
                        className="bg-[#10a345] hover:bg-[#0e8f3c]"
                        onPress={() => setStatus("approved")}
                    />
                    <FilterActionButton
                        label="Từ chối"
                        icon={<XCircleIcon className="w-4 h-4" />}
                        className="bg-[#ff0000] hover:bg-[#e60000]"
                        onPress={() => setStatus("rejected")}
                    />
                    <FilterActionButton
                        label="Chờ"
                        icon={<ClockIcon className="w-4 h-4" />}
                        className="bg-[#e2f2ea] text-[#10a345] hover:bg-[#d5ebe1]"
                        onPress={() => setStatus("pending")}
                    />
                </div>
            </div>

            {/* Row 2 */}
            <div className="md:col-span-6 space-y-1">
                <FilterLabel>Chi nhánh</FilterLabel>
                <Select
                    defaultSelectedKeys={["nam_dinh"]}
                    variant="faded"
                    radius="md"
                    size="md"
                    classNames={{
                        trigger: "h-11 bg-gray-50/50 border-gray-100 hover:border-blue-200 transition-all shadow-sm",
                    }}
                >
                    {branches.map((item) => (
                        <SelectItem key={item.value} textValue={item.label}>{item.label}</SelectItem>
                    ))}
                </Select>
            </div>

            <div className="md:col-span-6 space-y-1">
                <FilterLabel>Nhánh tổng</FilterLabel>
                <Select
                    defaultSelectedKeys={["all"]}
                    variant="faded"
                    radius="md"
                    size="md"
                    classNames={{
                        trigger: "h-11 bg-gray-50/50 border-gray-100 hover:border-blue-200 transition-all shadow-sm",
                    }}
                >
                    {totalBranches.map((item) => (
                        <SelectItem key={item.value} textValue={item.label}>{item.label}</SelectItem>
                    ))}
                </Select>
            </div>

            {/* Row 3 */}
            <div className="md:col-span-6 space-y-1">
                <FilterLabel>Đồng hồ tổng</FilterLabel>
                <SearchInputWithButton
                    placeholder="Nhập mã đồng hồ"
                />
            </div>

            <div className="md:col-span-6 space-y-1">
                <FilterLabel>Mã lộ trình</FilterLabel>
                <SearchInputWithButton
                    placeholder="Nhập mã lộ trình"
                />
            </div>

            {/* Row 4 */}
            <div className="md:col-span-12 space-y-1">
                <FilterLabel>Nội dung</FilterLabel>
                <Input
                    placeholder="Nhập nội dung liên quan..."
                    variant="faded"
                    radius="md"
                    size="md"
                    classNames={{
                        inputWrapper: "h-11 bg-gray-50/50 border-gray-100 focus-within:!border-blue-500 transition-all",
                    }}
                />
            </div>
        </GenericSearchFilter>
    );
};
