"use client";

import React from "react";
import { Divider } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import { TitleDarkColor } from "@/config/chip-and-icon";
import { BillingInfoProps } from "@/types";
import CustomSelect from "@/components/ui/custom/CustomSelect";

export const BillingInfo = ({ formData, onUpdate }: BillingInfoProps) => {
  const parseDateString = (dateString: string) => {
    if (!dateString) return null;
    try {
      return parseDate(dateString);
    } catch {
      return null;
    }
  };
  return (
    <>
      <div>
        <div className="space-y-6 pb-6 border-b border-gray-100 dark:border-divider">
          <h2
            className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
          >
            Thông tin ngân hàng
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <CustomSelect
            label="Phương thức thanh toán"
            options={[
              { value: "CASH", label: "Tiền mặt" },
              { value: "BANK_TRANSFER", label: "Chuyển khoản" },
              { value: "QR_CODE", label: "Quét mã QR" },
            ]}
            selectedKeys={
              formData.paymentMethod
                ? new Set([formData.paymentMethod])
                : new Set()
            }
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              onUpdate("paymentMethod", value);
            }}
          />
          <CustomInput
            label="Số tài khoản ngân hàng"
            value={formData.bankAccountNumber}
            onValueChange={(value) => onUpdate("bankAccountNumber", value)}
          />

          <CustomInput
            label="Ngân hàng"
            value={formData.bankAccountProviderLocation}
            onValueChange={(value) =>
              onUpdate("bankAccountProviderLocation", value)
            }
          />

          <CustomInput
            label="Tên tài khoản"
            value={formData.bankAccountName}
            onValueChange={(value) => onUpdate("bankAccountName", value)}
          />
        </div>
      </div>

      <Divider className="mt-6 mb-6" />

      <div>
        <div className="space-y-6 pb-6 border-b border-gray-100 dark:border-divider">
          <h2
            className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
          >
            Thông tin phụ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomDatePicker
            label="Kỳ khấu trừ"
            value={parseDateString(formData.deductionPeriod)}
            onChange={(date) => {
              if (date) {
                const dateStr = `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
                onUpdate("deductionPeriod", dateStr);
              } else {
                onUpdate("deductionPeriod", "");
              }
            }}
          />

          <CustomInput
            label="M3 khuyến mãi"
            type="number"
            value={formData.m3Sale}
            onValueChange={(value) => onUpdate("m3Sale", value)}
          />
        </div>
      </div>

      <Divider className="mt-6 mb-6" />
    </>
  );
};
