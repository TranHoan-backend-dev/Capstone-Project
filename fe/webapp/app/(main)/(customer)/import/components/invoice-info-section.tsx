"use client";

import { Checkbox, Card, CardBody } from "@heroui/react";
import { useState } from "react";

import CustomInput from "@/components/ui/custom/CustomInput";
import CustomTextarea from "@/components/ui/custom/CustomTextarea";

export const InvoiceInfoSection = () => {
  const [hasInvoice, setHasInvoice] = useState(false);

  return (
    <Card shadow="sm" radius="lg" className="col-span-full">
      <CardBody className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold text-gray-800 dark:text-foreground">
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

          <CustomTextarea
            className="col-span-full"
            label="Ghi chú"
            placeholder="Nhập ghi chú thêm (nếu có)"
            rows={3}
          />
        </div>
      </CardBody>
    </Card>
  );
};
