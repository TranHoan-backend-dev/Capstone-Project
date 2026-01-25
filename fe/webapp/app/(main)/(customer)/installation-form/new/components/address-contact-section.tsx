"use client";

import React from "react";

import { TitleDarkColor } from "@/config/chip-and-icon";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";

export const AddressContactSection = () => {
  const aboveInputFieldContent = [
    { label: "Địa chỉ nhà", isRequired: true },
    { label: "Đường / Thôn / Xóm" },
    { label: "Điện thoại liên hệ", isRequired: true },
    { label: "Email" },
  ];

  const selectFieldContent = ["Chọn phường / xã"];

  return (
    <div className="space-y-6">
      <div className="space-y-6 pb-6 border-b border-gray-100 dark:border-divider">
        <h2
          className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
        >
          Địa chỉ lắp đặt & Liên hệ
        </h2>
        <div className="space-y-4">
          {aboveInputFieldContent.map((item, index) => (
            <div key={index} className="space-y-1">
              <CustomInput isRequired={item.isRequired} label={item.label} />
            </div>
          ))}
          {selectFieldContent.map((item, index) => (
            <div key={index} className="space-y-1">
              <CustomSelect
                isRequired
                label={item}
                options={[{ value: "p1", label: "Phường 1" }]}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 py-2">
        <h2
          className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
        >
          Thông tin ngân hàng
        </h2>
        <div className="space-y-1 pt-0.5">
          <CustomSelect
            defaultSelectedKeys={new Set(["no"])}
            label="Thanh toán qua ngân hàng"
            options={[
              { value: "no", label: "Không" },
              { value: "bank", label: "Có" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
