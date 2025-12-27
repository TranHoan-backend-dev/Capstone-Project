"use client";

import React from "react";
import { Input, Select, SelectItem, Checkbox } from "@heroui/react";

const fieldClassNames = {
    label: "text-[13px] font-semibold text-gray-700 mb-1",
    inputWrapper: "h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 focus-within:!border-blue-500 transition-all shadow-sm",
    input: "text-[13px]",
    trigger: "h-9 min-h-9 bg-gray-50/30 border-gray-100 hover:border-blue-200 transition-all shadow-sm",
    value: "text-[13px]",
};

export const CustomerInfoSection = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Thông tin khách hàng</h2>
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className={fieldClassNames.label}>Họ tên khách hàng <span className="text-red-500">*</span></label>
                    <Input
                        placeholder="Nhập họ tên"
                        variant="faded"
                        radius="md"
                        classNames={{ inputWrapper: fieldClassNames.inputWrapper, input: fieldClassNames.input }}
                    />
                </div>
                <div className="space-y-1">
                    <label className={fieldClassNames.label}>Giới tính</label>
                    <Select
                        defaultSelectedKeys={["male"]}
                        variant="faded"
                        radius="md"
                        classNames={{ trigger: fieldClassNames.trigger, value: fieldClassNames.value }}
                    >
                        <SelectItem key="male" textValue="Nam">Nam</SelectItem>
                        <SelectItem key="female" textValue="Nữ">Nữ</SelectItem>
                    </Select>
                </div>
                <div className="space-y-1">
                    <label className={fieldClassNames.label}>Số CMND / CCCD <span className="text-red-500">*</span></label>
                    <Input
                        placeholder="Nhập số CMND/CCCD"
                        variant="faded"
                        radius="md"
                        classNames={{ inputWrapper: fieldClassNames.inputWrapper, input: fieldClassNames.input }}
                    />
                </div>
                <div className="space-y-1">
                    <label className={fieldClassNames.label}>Mã hộ khẩu</label>
                    <Input
                        placeholder="Nhập mã hộ khẩu"
                        variant="faded"
                        radius="md"
                        classNames={{ inputWrapper: fieldClassNames.inputWrapper, input: fieldClassNames.input }}
                    />
                </div>
                <div className="space-y-1">
                    <label className={fieldClassNames.label}>Mã số thuế</label>
                    <Input
                        placeholder="Nhập mã số thuế"
                        variant="faded"
                        radius="md"
                        classNames={{ inputWrapper: fieldClassNames.inputWrapper, input: fieldClassNames.input }}
                    />
                </div>
                <div className="space-y-1">
                    <label className={fieldClassNames.label}>Loại khách hàng</label>
                    <Select
                        defaultSelectedKeys={["family"]}
                        variant="faded"
                        radius="md"
                        classNames={{ trigger: fieldClassNames.trigger, value: fieldClassNames.value }}
                    >
                        <SelectItem key="family" textValue="Gia đình">Gia đình</SelectItem>
                        <SelectItem key="business" textValue="Doanh nghiệp">Doanh nghiệp</SelectItem>
                    </Select>
                </div>
                <div className="space-y-1">
                    <label className={fieldClassNames.label}>Số hộ dùng chung</label>
                    <Input
                        placeholder="0"
                        type="number"
                        variant="faded"
                        radius="md"
                        classNames={{ inputWrapper: fieldClassNames.inputWrapper, input: fieldClassNames.input }}
                    />
                </div>
                <div className="space-y-2 pt-2">
                    <label className={fieldClassNames.label}>Mục đích sử dụng</label>
                    <div className="flex flex-col gap-2">
                        <Checkbox size="sm" classNames={{ label: "text-[13px]" }}>Sinh hoạt</Checkbox>
                        <Checkbox size="sm" classNames={{ label: "text-[13px]" }}>Kinh doanh</Checkbox>
                        <Checkbox size="sm" classNames={{ label: "text-[13px]" }}>Sản xuất</Checkbox>
                    </div>
                </div>
            </div>
        </div>
    );
};
