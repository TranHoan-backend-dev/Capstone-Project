"use client";

import React from "react";
import { Button } from "@heroui/react";
import {
    DocumentCheckIcon,
    PlusIcon,
    TrashIcon
} from "@heroicons/react/24/outline";

export const FormActions = () => {
    return (
        <div className="flex justify-between items-center pt-8 border-t border-gray-100">
            <div className="flex gap-3">
                <Button
                    color="primary"
                    className="bg-blue-600 h-10 px-6 font-bold text-[13px]"
                    startContent={<DocumentCheckIcon className="w-5 h-5" />}
                >
                    Lưu đơn
                </Button>
                <Button
                    color="success"
                    className="bg-[#10a345] text-white h-10 px-6 font-bold text-[13px]"
                    startContent={<PlusIcon className="w-5 h-5" />}
                >
                    Lưu & Tạo mới
                </Button>
            </div>
            <div className="flex gap-3">
                <Button
                    variant="flat"
                    className="bg-white border border-gray-200 text-gray-600 h-10 px-8 font-bold text-[13px]"
                >
                    Hủy
                </Button>
                <Button
                    color="danger"
                    className="bg-[#ff0000] h-10 px-8 font-bold text-[13px]"
                    startContent={<TrashIcon className="w-5 h-5" />}
                >
                    Xóa
                </Button>
            </div>
        </div>
    );
};
