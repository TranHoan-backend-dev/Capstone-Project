"use client";

import React from "react";
import { Divider } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import { TitleDarkColor } from "@/config/chip-and-icon";
import { CreateCustomerPayload } from "@/types";

interface BillingInfoProps {
  formData: CreateCustomerPayload;
  onUpdate: (field: keyof CreateCustomerPayload, value: any) => void;
}

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CustomDatePicker
            label="Kỳ khấu trừ"
            value={parseDateString(formData.deductionPeriod)}
            onChange={(date) => {
              if (date) {
                // date là DateValue object từ HeroUI DatePicker
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

          <CustomInput
            label="Giá cố định"
            value={formData.fixRate}
            onValueChange={(value) => onUpdate("fixRate", value)}
          />
        </div>
      </div>

      <Divider className="mt-6 mb-6" />
    </>
  );
};
