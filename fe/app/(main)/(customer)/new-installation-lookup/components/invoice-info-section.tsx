"use client";

import { Checkbox, Divider, Textarea } from "@heroui/react";
import { useState } from "react";

import CustomInput from "@/components/ui/custom/CustomInput";
import { TitleDarkColor } from "@/config/chip-and-icon";

export const InvoiceInfoSection = () => {
  const [hasInvoice, setHasInvoice] = useState(false);

  return (
    <div className="col-span-full space-y-4">
      <div className="flex items-center gap-4">
        <h2
          className={`text-sm font-bold text-blue-600 uppercase tracking-wider ${TitleDarkColor}`}
        >
          Thông tin hóa đơn
        </h2>

        <Checkbox
          isSelected={hasInvoice}
          size="sm"
          onValueChange={setHasInvoice}
        >
          Xuất hóa đơn
        </Checkbox>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CustomInput label="Tên xuất hóa đơn" />
        <CustomInput label="Địa chỉ xuất hóa đơn" />
        <Textarea label="Nội dung" variant="bordered" />
      </div>
      <Divider className="mb-6" />
    </div>
  );
};
