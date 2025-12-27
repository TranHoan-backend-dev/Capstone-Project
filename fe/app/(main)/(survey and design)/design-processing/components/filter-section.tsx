"use client";

import React from "react";
import { Select, SelectItem, Button, DatePicker, useDisclosure, Textarea } from "@heroui/react";
import { SearchIcon } from "@/components/ui/Icons";
import { TrashIcon } from "@heroicons/react/24/outline";
import { GenericSearchFilter, FilterLabel } from "@/components/ui/GenericSearchFilter";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { SubMasterMeterModal } from "./sub-master-meter-modal";
import { RouteListModal } from "./route-list-modal";

export const FilterSection = () => {
    const { isOpen: isMeterOpen, onOpen: onMeterOpen, onOpenChange: onMeterOpenChange } = useDisclosure();
    const { isOpen: isRouteOpen, onOpen: onRouteOpen, onOpenChange: onRouteOpenChange } = useDisclosure();

    const branches = [
        { label: "Thành phố Nam Định", value: "nam_dinh" },
    ];

    const totalBranches = [
        { label: "Tất cả", value: "all" },
    ];

    return (
        <>
            <GenericSearchFilter
                title="Xử lí đơn chờ thiết kế & Thiết kế"
                icon={<SearchIcon size={18} />}
                gridClassName="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4"
                isCollapsible
                actions={<></>}
            >
                <div className="md:col-span-6 space-y-4">
                    <div className="space-y-1">
                        <FilterLabel>Ngày duyệt đơn</FilterLabel>
                        <DatePicker
                            variant="faded"
                            radius="md"
                            size="md"
                            className="max-w-full"
                            classNames={{
                                base: "h-9 min-h-9",
                                calendarContent: "bg-white",
                                selectorButton: "h-9 w-9",
                                inputWrapper: "h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 focus-within:!border-blue-500 transition-all shadow-sm",
                                input: "text-[13px]",
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <SelectField label="Chi nhánh" options={branches} colSpan="col-span-1" />
                        <SelectField label="Nhánh tổng" options={totalBranches} colSpan="col-span-1" />
                    </div>

                    <SearchInputField
                        label="Đồng hồ tổng"
                        placeholder="Nhập mã ĐHT"
                        onSearchClick={onMeterOpen}
                        colSpan="col-span-12"
                    />

                    <SearchInputField
                        label="Mã lộ trình"
                        placeholder="Nhập mã lộ trình"
                        onSearchClick={onRouteOpen}
                        colSpan="col-span-12"
                    />
                </div>

                <div className="md:col-span-6 flex flex-col h-full space-y-4">
                    {/* Right half: Content and Clear button */}
                    <div className="flex-1 flex flex-col space-y-1">
                        <FilterLabel>Nội dung</FilterLabel>
                        <Textarea
                            disableAnimation
                            isClearable
                            disableAutosize
                            placeholder="Nhập nội dung liên quan..."
                            variant="faded"
                            radius="md"
                            size="md"
                            className="flex-1"
                            classNames={{
                                inputWrapper: "h-full min-h-[160px] bg-gray-50/30 border-gray-100 focus-within:!border-blue-500 transition-all shadow-sm items-start py-2",
                                input: "text-[13px] h-full",
                            }}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            className="bg-gray-100 text-gray-700 font-bold px-6 shadow-none border border-gray-200 h-9 shrink-0"
                            startContent={<TrashIcon className="w-5 h-5" />}
                            size="md"
                            radius="md"
                        >
                            Xóa các lựa chọn
                        </Button>
                    </div>
                </div>
            </GenericSearchFilter>

            <SubMasterMeterModal isOpen={isMeterOpen} onOpenChange={onMeterOpenChange} />
            <RouteListModal isOpen={isRouteOpen} onOpenChange={onRouteOpenChange} />
        </>
    );
};

export const SearchInputField = ({ label, placeholder, onSearchClick, colSpan = "md:col-span-6" }: { label: string; placeholder: string; onSearchClick?: () => void; colSpan?: string }) => {
    return (
        <div className={`${colSpan} space-y-1`}>
            <FilterLabel>{label}</FilterLabel>
            <SearchInputWithButton
                placeholder={placeholder}
                onSearch={onSearchClick}
            />
        </div>
    );
}

export const SelectField = ({ label, options, colSpan = "md:col-span-6" }: { label: string; options: { value: string; label: string }[]; colSpan?: string }) => {
    return (
        <div className={`${colSpan} space-y-1`}>
            <FilterLabel>{label}</FilterLabel>
            <Select
                defaultSelectedKeys={["all"]}
                variant="faded"
                radius="md"
                size="md"
                classNames={{
                    trigger: "h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 transition-all shadow-sm",
                    value: "text-[13px]",
                }}
            >
                {options.map((item) => (
                    <SelectItem key={item.value}>{item.label}</SelectItem>
                ))}
            </Select>
        </div>
    );
}
