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

export const AddressContactSection = () => {
    return (
        <div className="space-y-6">
            <div className="space-y-6 pb-6 border-b border-gray-100">
                <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">Địa chỉ lắp đặt & Liên hệ</h2>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className={fieldClassNames.label}>Địa chỉ nhà <span className="text-red-500">*</span></label>
                        <Input
                            placeholder="Nhập địa chỉ"
                            variant="faded"
                            radius="md"
                            classNames={{ inputWrapper: fieldClassNames.inputWrapper, input: fieldClassNames.input }}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={fieldClassNames.label}>Đường / Thôn / Xóm</label>
                        <Input
                            placeholder="Nhập tên đường"
                            variant="faded"
                            radius="md"
                            classNames={{ inputWrapper: fieldClassNames.inputWrapper, input: fieldClassNames.input }}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={fieldClassNames.label}>Phường / Xã <span className="text-red-500">*</span></label>
                        <Select
                            placeholder="Chọn phường / xã"
                            variant="faded"
                            radius="md"
                            classNames={{ trigger: fieldClassNames.trigger, value: fieldClassNames.value }}
                        >
                            <SelectItem key="p1" textValue="Phường 1">Phường 1</SelectItem>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <label className={fieldClassNames.label}>Tỉnh / Thành phố <span className="text-red-500">*</span></label>
                        <Select
                            placeholder="Chọn tỉnh / thành phố"
                            variant="faded"
                            radius="md"
                            classNames={{ trigger: fieldClassNames.trigger, value: fieldClassNames.value }}
                        >
                            <SelectItem key="hanoi" textValue="Hà Nội">Hà Nội</SelectItem>
                            <SelectItem key="namdinh" textValue="Nam Định">Nam Định</SelectItem>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <label className={fieldClassNames.label}>Điện thoại liên hệ <span className="text-red-500">*</span></label>
                        <Input
                            placeholder="Nhập số điện thoại"
                            variant="faded"
                            radius="md"
                            classNames={{ inputWrapper: fieldClassNames.inputWrapper, input: fieldClassNames.input }}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={fieldClassNames.label}>Email</label>
                        <Input
                            placeholder="Nhập email"
                            variant="faded"
                            radius="md"
                            classNames={{ inputWrapper: fieldClassNames.inputWrapper, input: fieldClassNames.input }}
                        />
                    </div>
                </div>
            </div>

            {/* Thông tin ngân hàng */}
            <div className="space-y-4 py-2 border-b border-gray-100">
                <h2 className="text-[13px] font-bold text-gray-800">Thông tin ngân hàng</h2>
                <div className="space-y-1">
                    <label className={fieldClassNames.label}>Thanh toán qua ngân hàng</label>
                    <Select
                        defaultSelectedKeys={["no"]}
                        variant="faded"
                        radius="md"
                        classNames={{ trigger: fieldClassNames.trigger, value: fieldClassNames.value }}
                    >
                        <SelectItem key="no" textValue="Không">Không</SelectItem>
                        <SelectItem key="bank" textValue="Có">Có</SelectItem>
                    </Select>
                </div>
            </div>

            {/* Thông tin xuất hóa đơn */}
            <div className="space-y-4 py-2">
                <h2 className="text-[13px] font-bold text-gray-800">Thông tin xuất hóa đơn</h2>
                <Checkbox size="sm" classNames={{ label: "text-[13px]" }}>Xuất hóa đơn</Checkbox>
            </div>
        </div>
    );
};
