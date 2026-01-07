"use client";

import {
    MagnifyingGlassIcon,
    PlusIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";

export const FormActions = () => {
    return (
        <div className="flex justify-end items-center pt-8 border-t border-gray-100 gap-3">
            <Button
                color="primary"
                className="bg-[#2563eb] h-10 px-8 font-medium text-[14px]"
                startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
                radius="md"
                onPress={() => { }}
            >
                Tìm
            </Button>
            <Button
                className="bg-[#10a345] text-white h-10 px-6 font-bold text-[13px]"
                color="success"
                startContent={<PlusIcon className="w-5 h-5" />}
                onPress={() => { }}
            >
                Lưu & Tạo mới
            </Button>
            <Button
                className="bg-gray-100 dark:bg-default-100 text-gray-700 dark:text-foreground font-bold px-6 shadow-none border border-gray-200 dark:border-divider h-9 shrink-0"
                radius="md"
                size="md"
                startContent={<TrashIcon className="w-5 h-5" />}
            >
                Xóa các lựa chọn
            </Button>
        </div>
    );
};

