"use client";

import { Input, Checkbox } from "@heroui/react";
import { useState } from "react";

export const InvoiceInfoSection = () => {
  const [hasInvoice, setHasInvoice] = useState(false);

  return (
    <div className="col-span-full space-y-4 pt-4 border-t border-gray-100 dark:border-divider">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-bold text-gray-800 dark:text-foreground">
          Thông tin hóa đơn
        </h2>

        <Checkbox
          size="sm"
          isSelected={hasInvoice}
          onValueChange={setHasInvoice}
        >
          Xuất hóa đơn
        </Checkbox>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Input
          label="Tên xuất hóa đơn"
          placeholder="Nhập tên xuất hóa đơn"
          variant="bordered"
          labelPlacement="inside"
        />

        <Input
          label="Địa chỉ xuất hóa đơn"
          placeholder="Nhập địa chỉ xuất hóa đơn"
          variant="bordered"
          labelPlacement="inside"
        />
      </div>
    </div>
  );
};
