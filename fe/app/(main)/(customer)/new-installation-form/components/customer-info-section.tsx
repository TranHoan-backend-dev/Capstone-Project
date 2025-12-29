"use client";

import React from "react";
import { Input, Select, SelectItem, Checkbox } from "@heroui/react";

export const CustomerInfoSection = () => {
    const mainInputContent = [
        { label: "Họ tên khách hàng", isRequired: true },
        { label: "Số CMND / CCCD", isRequired: true },
        { label: "Mã hộ khẩu" },
        { label: "Mã số thuế" },
        { label: "Số hộ dùng chung", type: "number", placeholder: "0" }
    ];

    const selectFieldContent = [
        {
            label: "Giới tính",
            options: [
                { key: "male", label: "Nam" },
                { key: "female", label: "Nữ" }
            ],
            defaultKey: "male"
        },
        {
            label: "Loại khách hàng",
            options: [
                { key: "family", label: "Gia đình" },
                { key: "business", label: "Doanh nghiệp" }
            ],
            defaultKey: "family"
        }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Thông tin khách hàng</h2>
            <div className="space-y-4">
                {mainInputContent.slice(0, 2).map((item, index) => (
                    <div key={index} className="space-y-1">
                        <Input
                            variant="bordered"
                            radius="md"
                            label={item.label}
                            isRequired={item.isRequired}
                            placeholder={item.placeholder}
                            type={item.type}
                            labelPlacement="inside"
                        />
                    </div>
                ))}

                {selectFieldContent.map((item, index) => (
                    <div key={index} className="space-y-1">
                        <Select
                            label={item.label}
                            variant="bordered"
                            radius="md"
                            labelPlacement="inside"
                            defaultSelectedKeys={item.defaultKey ? [item.defaultKey] : undefined}
                        >
                            {item.options.map((opt) => (
                                <SelectItem key={opt.key} textValue={opt.label}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                ))}

                {mainInputContent.slice(2).map((item, index) => (
                    <div key={index} className="space-y-1">
                        <Input
                            variant="bordered"
                            radius="md"
                            label={item.label}
                            isRequired={item.isRequired}
                            placeholder={item.placeholder}
                            type={item.type}
                            labelPlacement="inside"
                        />
                    </div>
                ))}

                <div className="space-y-2 pt-2">
                    <Select
                        label="Mục đích sử dụng"
                        variant="bordered"
                        radius="md"
                        labelPlacement="inside"
                    >
                        <SelectItem key="sinh-hoat" textValue="Sinh hoạt">
                            Sinh hoạt
                        </SelectItem>
                        <SelectItem key="kinh-doanh" textValue="Kinh doanh">
                            Kinh doanh
                        </SelectItem>
                        <SelectItem key="san-xuat" textValue="Sản xuất">
                            Sản xuất
                        </SelectItem>
                    </Select>
                </div>
            </div>
        </div>
    );
};
