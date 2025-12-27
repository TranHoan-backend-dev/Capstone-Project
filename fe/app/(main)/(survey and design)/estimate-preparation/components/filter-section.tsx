"use client";

import React, { useState } from "react";
import {
    Input,
    Button,
    DatePicker,
    Select,
    SelectItem
} from "@heroui/react";
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    TrashIcon
} from "@heroicons/react/24/outline";
import { GenericSearchFilter, FilterLabel } from "@/components/ui/GenericSearchFilter";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { SearchIcon } from "@/components/ui/Icons";

export const FilterSection = () => {
    const [status, setStatus] = useState<"approved" | "rejected" | "pending">("approved");

    return (
        <GenericSearchFilter
            title="Lập dự toán"
            icon={<SearchIcon size={18} />}
            gridClassName="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4"
            isCollapsible
            actions={
                <Button
                    variant="flat"
                    color="default"
                    className="bg-gray-100 text-gray-600 font-bold px-6"
                    startContent={<TrashIcon className="w-4 h-4" />}
                >
                    Xóa toàn bộ lựa chọn
                </Button>
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
                    <Button
                        size="sm"
                        variant={"solid"}
                        color={"success"}
                        className={"text-white font-bold"}
                        startContent={<CheckCircleIcon className="w-4 h-4" />}
                        onPress={() => setStatus("approved")}
                    >
                        Duyệt đơn
                    </Button>
                    <Button
                        size="sm"
                        variant={"solid"}
                        color={"danger"}
                        className={"text-white font-bold"}
                        startContent={<XCircleIcon className="w-4 h-4" />}
                        onPress={() => setStatus("rejected")}
                    >
                        Từ chối
                    </Button>
                    <Button
                        size="sm"
                        variant={"solid"}
                        color={"default"}
                        className={"text-white font-bold"}
                        startContent={<ClockIcon className="w-4 h-4" />}
                        onPress={() => setStatus("pending")}
                    >
                        Chờ
                    </Button>
                </div>
            </div>

            {/* Row 2 */}
            <div className="md:col-span-6 space-y-1">
                <FilterLabel>Chi nhánh</FilterLabel>
                <Select
                    placeholder="Thành phố Nam Định"
                    variant="faded"
                    radius="md"
                    size="md"
                    classNames={{
                        trigger: "h-11 bg-gray-50/50 border-gray-100 hover:border-blue-200 transition-all shadow-sm",
                    }}
                >
                    <SelectItem key="nam-dinh">Thành phố Nam Định</SelectItem>
                </Select>
            </div>

            <div className="md:col-span-6 space-y-1">
                <FilterLabel>Nhánh tổng</FilterLabel>
                <Select
                    placeholder="Tất cả"
                    variant="faded"
                    radius="md"
                    size="md"
                    classNames={{
                        trigger: "h-11 bg-gray-50/50 border-gray-100 hover:border-blue-200 transition-all shadow-sm",
                    }}
                >
                    <SelectItem key="all">Tất cả</SelectItem>
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
