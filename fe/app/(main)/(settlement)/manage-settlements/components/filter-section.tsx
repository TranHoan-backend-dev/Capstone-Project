"use client";

import React from "react";
import { Input, Button } from "@heroui/react";
import { SearchIcon } from "@/components/ui/Icons";
import {
    PlusIcon,
    TrashIcon,
    XMarkIcon,
    CheckIcon
} from "@heroicons/react/24/outline";
import { GenericSearchFilter, FilterLabel } from "@/components/ui/GenericSearchFilter";
import { FilterActionButton } from "@/components/ui/FilterActionButton";

export const FilterSection = () => {
    return (
        <GenericSearchFilter
            title="Quản lý mẫu bốc vật tư"
            icon={<SearchIcon size={18} />}
            gridClassName="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4"
            isCollapsible
            actions={<></>}
        >
            <div className="md:col-span-6 space-y-1">
                <FilterLabel>Mã mẫu bốc vật tư</FilterLabel>
                <Input
                    placeholder="Nhập mã mẫu"
                    variant="faded"
                    radius="md"
                    size="md"
                    classNames={{
                        inputWrapper: "h-9 min-h-9 bg-gray-50/50 border-gray-100 focus-within:!border-blue-500 transition-all",
                        input: "text-[13px]",
                    }}
                />
            </div>
            <div className="md:col-span-6 space-y-1">
                <FilterLabel>Tên mẫu bốc vật tư</FilterLabel>
                <Input
                    placeholder="Nhập tên mẫu"
                    variant="faded"
                    radius="md"
                    size="md"
                    classNames={{
                        inputWrapper: "h-9 min-h-9 bg-gray-50/50 border-gray-100 focus-within:!border-blue-500 transition-all",
                        input: "text-[13px]",
                    }}
                />
            </div>

            <div className="md:col-span-12 flex flex-wrap gap-2 mt-2">
                <FilterActionButton
                    label="Lưu"
                    icon={<CheckIcon className="w-4 h-4" />}
                    className="bg-[#10a345] hover:bg-[#0e8f3c]"
                />
                <FilterActionButton
                    label="Hủy"
                    icon={<XMarkIcon className="w-4 h-4" />}
                    className="bg-[#ff0000] hover:bg-[#e60000]"
                />
                <FilterActionButton
                    label="Thêm mới"
                    icon={<PlusIcon className="w-4 h-4" />}
                    className="bg-[#e2f2ea] text-[#10a345] hover:bg-[#d5ebe1]"
                />
            </div>
        </GenericSearchFilter>
    );
};
