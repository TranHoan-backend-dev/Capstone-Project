"use client";

import React from "react";
import { Button } from "@heroui/react";
import {
    MagnifyingGlassIcon,
    DevicePhoneMobileIcon, // Hoặc dùng icon Disk tương đương
    ArrowPathIcon
} from "@heroicons/react/24/outline";

export const FormActions = () => {
    return (
        <div className="flex justify-between items-center pt-8 border-t border-gray-100">
            {/* Nút bên trái: Làm mới bộ lọc */}
            <div>
                <Button
                    className="bg-[#71717a] text-white font-medium px-4 h-10 shrink-0"
                    startContent={<ArrowPathIcon className="w-5 h-5" />}
                    size="md"
                    radius="md"
                    onPress={() => {}}
                >
                    Làm mới bộ lọc
                </Button>
            </div>

            {/* Cụm nút bên phải: Tìm và Lưu đơn */}
            <div className="flex gap-3">
                <Button
                    color="primary"
                    className="bg-[#2563eb] h-10 px-8 font-medium text-[14px]"
                    startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
                    radius="md"
                    onPress={() => {}}
                >
                    Tìm
                </Button>
                <Button
                    className="bg-[#10a345] text-white h-10 px-8 font-medium text-[14px]"
                    // Sử dụng icon giống biểu tượng Lưu trữ (Disk) nếu có, ở đây dùng tạm icon đại diện
                    startContent={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>}
                    radius="md"
                    onPress={() => {}}
                >
                    Lưu đơn
                </Button>
            </div>
        </div>
    );
};