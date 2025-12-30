"use client";

import React from "react";
import { Input, DatePicker, Select, SelectItem } from "@heroui/react";

export const OrderInfoSection = () => {
    const inputFields = [
        { label: "Mã đơn", defaultValue: "DH001234" },
        { label: "Số đơn", defaultValue: "SO-2024-001" },
    ];

    const dateFields = [
        { label: "Ngày nhận đơn", isRequired: true },
        { label: "Ngày hẹn khảo sát" },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-sm font-bold text-blue-600 dark:text-primary-400 uppercase tracking-wider">Thông tin đơn</h2>
            <div className="space-y-4">
                {inputFields.map((item, index) => (
                    <div key={index} className="space-y-1">
                        <Input
                            label={item.label}
                            defaultValue={item.defaultValue}
                            variant="bordered"
                            radius="md"
                            labelPlacement="inside"
                        />
                    </div>
                ))}

                {dateFields.map((item, index) => (
                    <div key={index} className="space-y-1">
                        <DatePicker
                            label={item.label}
                            isRequired={item.isRequired}
                            variant="bordered"
                            radius="md"
                            labelPlacement="inside"
                            className="w-full"
                        />
                    </div>
                ))}

                <div className="space-y-1">
                    <Select
                        label="Trạng thái đơn"
                        defaultSelectedKeys={["new"]}
                        variant="bordered"
                        radius="md"
                        labelPlacement="inside"
                    >
                        <SelectItem key="new" textValue="Mới tạo">
                            Mới tạo
                        </SelectItem>
                        <SelectItem key="processing" textValue="Đang xử lý">
                            Đang xử lý
                        </SelectItem>
                    </Select>
                </div>
            </div>
        </div>
    );
};
