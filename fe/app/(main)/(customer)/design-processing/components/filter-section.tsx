"use client";

import React, { useState } from "react";
import { Input, Select, SelectItem, Button, DatePicker } from "@heroui/react";
import { SearchIcon } from "@/components/ui/Icons";
import { TrashIcon, CheckCircleIcon, XCircleIcon, ClockIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { GenericSearchFilter, FilterLabel } from "@/components/ui/GenericSearchFilter";

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
            icon={<div className="bg-blue-600 rounded-full p-1"><InformationCircleIcon className="w-4 h-4 text-white" /></div>}
            gridClassName="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4"
            actions={
                <Button
                    variant="flat"
                    color="default"
                    startContent={<TrashIcon className="w-4 h-4" />}
                    className="bg-gray-100 text-gray-600 font-bold px-6"
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
                        variant={status === "approved" ? "solid" : "flat"}
                        color={status === "approved" ? "success" : "default"}
                        className={status === "approved" ? "text-white font-bold" : "bg-gray-100 text-gray-500 font-medium"}
                        startContent={<CheckCircleIcon className="w-4 h-4" />}
                        onPress={() => setStatus("approved")}
                    >
                        Duyệt đơn
                    </Button>
                    <Button
                        size="sm"
                        variant={status === "rejected" ? "solid" : "flat"}
                        color={status === "rejected" ? "danger" : "default"}
                        className={status === "rejected" ? "text-white font-bold" : "bg-gray-100 text-gray-500 font-medium"}
                        startContent={<XCircleIcon className="w-4 h-4" />}
                        onPress={() => setStatus("rejected")}
                    >
                        Từ chối
                    </Button>
                    <Button
                        size="sm"
                        variant={status === "pending" ? "solid" : "flat"}
                        color={status === "pending" ? "default" : "default"}
                        className={status === "pending" ? "bg-gray-200 text-gray-700 font-bold" : "bg-gray-100 text-gray-500 font-medium"}
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
                <Input
                    placeholder="Nhập mã đồng hồ"
                    variant="faded"
                    radius="md"
                    size="md"
                    endContent={
                        <Button
                            size="sm"
                            color="primary"
                            startContent={<SearchIcon size={16} />}
                            className="h-8 px-4 bg-blue-600"
                        >
                            Tìm
                        </Button>
                    }
                    classNames={{
                        inputWrapper: "h-11 bg-gray-50/50 border-gray-100 focus-within:!border-blue-500 transition-all pr-1",
                    }}
                />
            </div>

            <div className="md:col-span-6 space-y-1">
                <FilterLabel>Mã lộ trình</FilterLabel>
                <Input
                    placeholder="Nhập mã lộ trình"
                    variant="faded"
                    radius="md"
                    size="md"
                    endContent={
                        <Button
                            size="sm"
                            color="primary"
                            startContent={<SearchIcon size={16} />}
                            className="h-8 px-4 bg-blue-600"
                        >
                            Tìm
                        </Button>
                    }
                    classNames={{
                        inputWrapper: "h-11 bg-gray-50/50 border-gray-100 focus-within:!border-blue-500 transition-all pr-1",
                    }}
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
