"use client";

import React from "react";
import { Input, DatePicker, Select, SelectItem } from "@heroui/react";

const fieldClassNames = {
    label: "text-[13px] font-semibold text-gray-700 mb-1",
    inputWrapper: "h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 focus-within:!border-blue-500 transition-all shadow-sm",
    input: "text-[13px]",
    trigger: "h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 transition-all shadow-sm",
    value: "text-[13px]",
};

export const OrderInfoSection = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Thông tin đơn</h2>
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className={fieldClassNames.label}>Mã đơn</label>
                    <Input
                        defaultValue="DH001234"
                        variant="faded"
                        radius="md"
                        classNames={{ inputWrapper: fieldClassNames.inputWrapper, input: fieldClassNames.input }}
                    />
                </div>
                <div className="space-y-1">
                    <label className={fieldClassNames.label}>Số đơn</label>
                    <Input
                        defaultValue="SO-2024-001"
                        variant="faded"
                        radius="md"
                        classNames={{ inputWrapper: fieldClassNames.inputWrapper, input: fieldClassNames.input }}
                    />
                </div>
                <div className="space-y-1">
                    <label className={fieldClassNames.label}>Ngày nhận đơn <span className="text-red-500">*</span></label>
                    <DatePicker
                        variant="faded"
                        radius="md"
                        className="w-full"
                        classNames={{
                            base: "h-9",
                            inputWrapper: fieldClassNames.inputWrapper,
                        }}
                    />
                </div>
                <div className="space-y-1">
                    <label className={fieldClassNames.label}>Ngày hẹn khảo sát</label>
                    <DatePicker
                        variant="faded"
                        radius="md"
                        className="w-full"
                        classNames={{
                            base: "h-9",
                            inputWrapper: fieldClassNames.inputWrapper,
                        }}
                    />
                </div>
                <div className="space-y-1">
                    <label className={fieldClassNames.label}>Trạng thái đơn</label>
                    <Select
                        defaultSelectedKeys={["new"]}
                        variant="faded"
                        radius="md"
                        classNames={{ trigger: fieldClassNames.trigger, value: fieldClassNames.value }}
                    >
                        <SelectItem key="new" textValue="Mới tạo">Mới tạo</SelectItem>
                        <SelectItem key="processing" textValue="Đang xử lý">Đang xử lý</SelectItem>
                    </Select>
                </div>
            </div>
        </div>
    );
};
