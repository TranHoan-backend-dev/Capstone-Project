"use client";

import React from "react";
import { Checkbox, Divider } from "@heroui/react";

import CustomInput from "@/components/ui/custom/CustomInput";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import { TitleDarkColor } from "@/config/chip-and-icon";
import CustomTextarea from "@/components/ui/custom/CustomTextarea";

export const BillingInfo = () => {
  return (
    <>
      <div>
        <div className="space-y-6 pb-6 border-b border-gray-100 dark:border-divider">
          <h2
            className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
          >
            Thông tin phụ
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CustomDatePicker label="Tháng nợ" />
          {["Kinh phí lắp đặt", "M3 khuyến mãi", "Thời gian khấu trừ"].map(
            (item, idx) => (
              <CustomInput key={idx} label={item} type="number" />
            ),
          )}
        </div>

        <div className="flex flex-wrap gap-10 pt-2">
          {["Để thông tin xuất hóa đơn", "Không tính tiền", "Khuyến mãi"].map(
            (item, idx) => (
              <Checkbox key={idx} size="sm" color="primary">
                {item}
              </Checkbox>
            ),
          )}
        </div>
      </div>
      <Divider className="mt-6 mb-6" />

      <div>
        <div className="space-y-6 pb-6 border-b border-gray-100 dark:border-divider">
          <h2
            className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
          >
            Thông tin hóa đơn
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput label="Tên xuất hóa đơn" />
          <CustomInput label="Địa chỉ xuất hóa đơn" />
          <div className="md:col-span-2">
            <CustomTextarea label="Ghi chú" placeholder="Nhập ghi chú" />
          </div>
        </div>
      </div>
      <Divider className="mt-6 mb-6" />
    </>
  );
};
