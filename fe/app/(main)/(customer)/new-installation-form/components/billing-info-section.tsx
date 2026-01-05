"use client";

import CustomInput from "@/components/ui/CustomInput";
import { Checkbox } from "@heroui/react";
import { useState } from "react";

export const BillingInfoSection = () => {
    const [isExportBill, setIsExportBill] = useState(false);

    return (
        <div className="space-y-4 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-700 uppercase">Thông tin hóa đơn</h3>
                <Checkbox
                    isSelected={isExportBill}
                    onValueChange={setIsExportBill}
                    size="sm"
                    classNames={{ label: "text-sm" }}
                >
                    Xuất hóa đơn
                </Checkbox>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <CustomInput
                    label="Tên xuất hóa đơn"
                    placeholder="Nhập tên xuất hóa đơn"
                    disabled={!isExportBill}
                />
                <CustomInput
                    label="Địa chỉ xuất hóa đơn"
                    placeholder="Nhập địa chỉ xuất hóa đơn"
                    disabled={!isExportBill}
                />
            </div>
        </div>
    );
};