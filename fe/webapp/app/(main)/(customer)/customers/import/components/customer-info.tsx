"use client";

import React from "react";
import { Divider } from "@heroui/react";

import CustomInput from "@/components/ui/custom/CustomInput";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import { TitleDarkColor } from "@/config/chip-and-icon";

export const CustomerInfo = () => {
  return (
    <div>
      <div className="space-y-6 pb-6 border-b border-gray-100 dark:border-divider">
        <h2
          className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
        >
          Thông tin đơn & định danh
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SearchInputWithButton label="Mã đơn" isRequired />
        {[
          { label: "Mã khách hàng", isRequired: false },
          { label: "Mã số thuế", isRequired: false },
          { label: "Tên khách hàng", isRequired: true },
          { label: "Số CCCD", isRequired: false },
          { label: "Số CCCD", isRequired: false },
        ].map((item, idx) => (
          <CustomInput
            key={idx}
            label={item.label}
            isRequired={item.isRequired}
          />
        ))}
        <CustomDatePicker label="Ngày cấp" />
        {[
          "Kỳ khai thác",
          "Mã số Quan hệ ngân sách",
          "Số điện thoại",
          "Mã hộ khẩu",
          "Mã Hộ Chiếu",
        ].map((item, idx) => (
          <CustomInput key={idx} label={item} />
        ))}
      </div>
      <Divider className="mt-6 mb-6" />
    </div>
  );
};
