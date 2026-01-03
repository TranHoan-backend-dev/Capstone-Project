"use client";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Input, Select, SelectItem } from "@heroui/react";

import { FilterActionButton } from "@/components/ui/FilterActionButton";

interface RestoreFilterProps {
    periodData: { label: string; value: string }[];
}

export const RestoreFilter = ({ periodData }: RestoreFilterProps) => {
    return (
        <GenericSearchFilter
            title="Khôi Phục Khách Hàng Hủy"
            icon={<SearchIcon size={18} />}
            gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3"
            isCollapsible
            actions={
                <>
                    {/* <FilterActionButton
                        label="Lưu"
                        icon={<CheckIcon className="w-4 h-4" />}
                        color="success"
                        className="bg-green-500 hover:bg-green-600 dark:shadow-md dark:shadow-success/40 mr-2"
                        onPress={() => { }}
                    /> */}
                    <FilterActionButton
                        label="Xóa lựa chọn"
                        icon={<XMarkIcon className="w-4 h-4" />}
                        color="default" 
                        className="bg-gray-500 hover:bg-gray-600 text-white mr-2" 
                        onPress={() => { }}
                    />
                    {/* <FilterButton /> */}
                </>
            }
        >
            <InputField label="Mã KH" />
            <InputField label="Tên khách hàng" />
            <InputField label="Số Điện Thoại" />
            <InputField label="Địa Chỉ" />
            <InputField label="Lý Do Khôi Phục" />
            <div className="space-y-1 lg:col-span-2">
                <Select
                    label="Kỳ Khôi Phục"
                    labelPlacement="inside"
                    defaultSelectedKeys={["T8/2025"]}
                    variant="bordered"
                    radius="md"
                    size="md"
                    className="font-bold"
                >
                    {periodData.map((item) => (
                        <SelectItem key={item.value} textValue={item.label}>{item.label}</SelectItem>
                    ))}
                </Select>
            </div>
        </GenericSearchFilter>
    );
};

export const InputField = ({ label }: { label: string }) => {
    return (
        <div className="space-y-1 lg:col-span-2">
            <Input
                label={label}
                labelPlacement="inside"
                variant="bordered"
                radius="md"
                size="md"
                className="font-bold"
            />
        </div>
    );
}
