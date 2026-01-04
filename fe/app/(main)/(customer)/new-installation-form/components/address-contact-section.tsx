"use client";

import React from "react";
import { Input, Select, SelectItem, Checkbox } from "@heroui/react";
import { TitleDarkColor } from "@/config/chip-and-icon";
import CustomInput from "@/components/ui/custom/CustomInput";

export const AddressContactSection = () => {
    const aboveInputFieldContent = [
        { "label": "Địa chỉ nhà", "isRequired": true },
        { "label": "Đường / Thôn / Xóm" },
        { "label": "Điện thoại liên hệ", "isRequired": true },
        { "label": "Email" }
    ]

    const belowInputFieldContent = [
        { "label": "Chọn phường / xã", "isRequired": true },
        { "label": "Chọn tỉnh / thành phố", "isRequired": true },
    ]

    const selectFieldContent = ["Chọn phường / xã", "Chọn tỉnh / thành phố"]

    return (
        <div className="space-y-6">
            <div className="space-y-6 pb-6 border-b border-gray-100 dark:border-divider">
                <h2 className={`text-sm font-bold text-blue-600 ${TitleDarkColor} uppercase tracking-wider`}>Địa chỉ lắp đặt & Liên hệ</h2>
                <div className="space-y-4">
                    {aboveInputFieldContent.map((item, index) => (
                        <div className="space-y-1" key={index}>
                            <CustomInput
                                label={item.label}
                                isRequired={item.isRequired}
                            />
                        </div>
                    ))}
                    {selectFieldContent.map((item, index) => (
                        <div className="space-y-1" key={index}>
                            <Select
                                label={item}
                                isRequired
                                variant="bordered"
                                radius="md"
                                labelPlacement="inside"
                            >
                                <SelectItem key="p1" textValue="Phường 1">Phường 1</SelectItem>
                            </Select>
                        </div>
                    ))}
                    {belowInputFieldContent.map((item, index) => (
                        <div className="space-y-1" key={index}>
                            <Input
                                variant="bordered"
                                radius="md"
                                label={item.label}
                                isRequired={item.isRequired}
                                labelPlacement="inside"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4 py-2 border-b border-gray-100 dark:border-divider">
                <h2 className={`text-[13px] font-bold text-gray-800 ${TitleDarkColor}`}>Thông tin ngân hàng</h2>
                <div className="space-y-1 pt-0.5">
                    <Select
                        label="Thanh toán qua ngân hàng"
                        defaultSelectedKeys={["no"]}
                        variant="bordered"
                        radius="md"
                    >
                        <SelectItem key="no" textValue="Không">Không</SelectItem>
                        <SelectItem key="bank" textValue="Có">Có</SelectItem>
                    </Select>
                </div>
            </div>

            <div className="space-y-4 py-2">
                <h2 className={`text-[13px] font-bold text-gray-800 ${TitleDarkColor}`}>Thông tin xuất hóa đơn</h2>
                <Checkbox size="sm" classNames={{ label: "text-[13px]" }}>Xuất hóa đơn</Checkbox>
            </div>
        </div>
    );
};
