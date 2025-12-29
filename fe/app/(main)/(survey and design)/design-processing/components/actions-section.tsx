"use client";

import React, { ChangeEventHandler, useState } from "react";
import { Select, SelectItem, Button, DatePicker, useDisclosure, Textarea, DateValue } from "@heroui/react";
import { SearchIcon } from "@/components/ui/Icons";
import { TrashIcon } from "@heroicons/react/24/outline";
import { GenericSearchFilter, FilterLabel } from "@/components/ui/GenericSearchFilter";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { SubMasterMeterModal } from "./sub-master-meter-modal";
import { RouteListModal } from "./route-list-modal";

export const ActionsSection = () => {
    const { isOpen: isMeterOpen, onOpen: onMeterOpen, onOpenChange: onMeterOpenChange } = useDisclosure();
    const { isOpen: isRouteOpen, onOpen: onRouteOpen, onOpenChange: onRouteOpenChange } = useDisclosure();
    const [acceptingFormDate, setAcceptingFormDate] = useState<DateValue | null | undefined>(null);
    const [branch, setBranch] = useState("nam_dinh");
    const [totalBranch, setTotalBranch] = useState("all");
    const [meterCode, setMeterCode] = useState("");
    const [routeCode, setRouteCode] = useState("");
    const [content, setContent] = useState("");

    const branches = [
        { label: "Thành phố Nam Định", value: "nam_dinh" },
    ];

    const totalBranches = [
        { label: "Tất cả", value: "all" },
    ];

    const handleClear = () => {
        setAcceptingFormDate(null);
        setBranch("nam_dinh");
        setTotalBranch("all");
        setMeterCode("");
        setRouteCode("");
        setContent("");
    };

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
                        <DatePicker
                            label="Ngày duyệt đơn"
                            variant="bordered"
                            radius="md"
                            size="md"
                            className="max-w-full font-bold"
                            value={acceptingFormDate}
                            onChange={setAcceptingFormDate}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <SelectField
                            label="Chi nhánh"
                            options={branches}
                            colSpan="col-span-1"
                            value={branch}
                            onValueChange={setBranch}
                        />
                        <SelectField
                            label="Nhánh tổng"
                            options={totalBranches}
                            colSpan="col-span-1"
                            value={totalBranch}
                            onValueChange={setTotalBranch}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <SearchInputField
                            label="Nhập mã đồng hồ tổng"
                            onSearchClick={onMeterOpen}
                            colSpan="col-span-1"
                            value={meterCode}
                            onValueChange={setMeterCode}
                        />
                        <SearchInputField
                            label="Nhập mã lộ trình"
                            onSearchClick={onRouteOpen}
                            colSpan="col-span-1"
                            value={routeCode}
                            onValueChange={setRouteCode}
                        />
                    </div>
                </div>

                <div className="md:col-span-6 flex flex-col h-full space-y-4">
                    <div className="flex-1 flex flex-col space-y-1">
                        <Textarea
                            label="Nội dung"
                            labelPlacement="inside"
                            disableAnimation
                            isClearable
                            disableAutosize
                            variant="bordered"
                            radius="md"
                            size="md"
                            className="flex-1 font-bold"
                            value={content}
                            onValueChange={setContent}
                            classNames={{
                                inputWrapper: "h-full min-h-[100px] bg-gray-50/30 border-gray-100 focus-within:!border-blue-500 transition-all shadow-sm items-start py-2",
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
                            onPress={handleClear}
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

export const SearchInputField = ({
    label,
    onSearchClick,
    colSpan = "md:col-span-6",
    value,
    onValueChange
}: {
    label: string;
    onSearchClick?: () => void;
    colSpan?: string,
    value: string,
    onValueChange: (val: string) => void
}) => {
    return (
        <div className={`${colSpan} space-y-1`}>
            <SearchInputWithButton
                placeholder={label}
                labelPlacement="inside"
                onSearch={onSearchClick}
                value={value}
                onValueChange={onValueChange}
                className="font-bold"
            />
        </div>
    );
}

export const SelectField = ({
    label,
    options,
    colSpan = "md:col-span-6",
    onValueChange
}: {
    label: string;
    options: { value: string; label: string }[];
    colSpan?: string,
    value: string,
    onValueChange: (val: string) => void
}) => {
    return (
        <div className={`${colSpan} space-y-1`}>
            <Select
                onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    if (selected) onValueChange(selected);
                }}
                label={label}
                labelPlacement="inside"
                variant="bordered"
                radius="md"
                size="md"
                className="font-bold"
            >
                {options.map((item) => (
                    <SelectItem key={item.value} textValue={item.label}>
                        {item.label}
                    </SelectItem>
                ))}
            </Select>
        </div>
    );
}
