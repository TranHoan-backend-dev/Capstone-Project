"use client";

import React from "react";
import { TitleDarkColor } from "@/config/chip-and-icon";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import CustomSingleDatePicker from "@/components/ui/custom/CustomSingleDatePickter";

export const OrderInfoSection = () => {
    const inputFields = [
        { label: "Mã đơn đăng ký", defaultValue: "DH001234" },
        { label: "Số đơn", defaultValue: "SO-2024-001" },
        { label: "Số hộ sử dụng", defaultValue: "1" },
        { label: "Số người sử dụng", defaultValue: "5" },
    ];

    const dateFields = [
        { label: "Ngày nhận đơn", isRequired: true },
        { label: "Ngày hẹn khảo sát" },
    ];

    return (
        <div className="space-y-6">
            <h2 className={`text-sm font-bold text-blue-600 ${TitleDarkColor} uppercase tracking-wider`}>Thông tin đơn</h2>
            <div className="space-y-4">
                {inputFields.map((item, index) => (
                    <div key={index} className="space-y-1">
                        <CustomInput
                            label={item.label}
                            defaultValue={item.defaultValue}
                            value={item.defaultValue}
                        />
                    </div>
                ))}

                {dateFields.map((item, index) => (
                    <div key={index} className="space-y-1">
                        <CustomSingleDatePicker
                            label={item.label}
                            isRequired={item.isRequired}
                            className="w-full"
                        />
                    </div>
                ))}

                <div className="space-y-1">
                    <CustomSelect
                        label="Trạng thái đơn"
                        defaultSelectedKeys={new Set(["new"])}
                        options={[
                            { value: "new", label: "Mới tạo" },
                            { value: "processing", label: "Đang xử lý" },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};
