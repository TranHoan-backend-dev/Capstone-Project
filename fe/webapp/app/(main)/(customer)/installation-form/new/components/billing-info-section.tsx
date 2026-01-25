"use client";

import { Checkbox } from "@heroui/react";
import { useState } from "react";

import CustomInput from "@/components/ui/custom/CustomInput";
import { TitleDarkColor } from "@/config/chip-and-icon";
import CustomTextarea from "@/components/ui/custom/CustomTextarea";

export const BillingInfoSection = () => {
  const [isExportBill, setIsExportBill] = useState(false);

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center gap-2">
        <h3
          className={`text-sm font-bold text-blue-600 ${TitleDarkColor} uppercase tracking-wider`}
        >
          Thông tin hóa đơn
        </h3>
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
        <CustomInput label="Tên xuất hóa đơn" />
        <CustomInput label="Địa chỉ xuất hóa đơn" />
      </div>
      <CustomTextarea label="Nội dung" />
    </div>
  );
};
