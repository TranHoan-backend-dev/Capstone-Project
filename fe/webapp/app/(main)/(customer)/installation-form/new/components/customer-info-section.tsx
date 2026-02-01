"use client";

import React from "react";

import { TitleDarkColor } from "@/config/chip-and-icon";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";

export const CustomerInfoSection = () => {
  const mainInputContent = [
    { label: "Họ tên khách hàng", isRequired: true },
    { label: "Số CMND / CCCD", isRequired: true },
    { label: "Mã hộ khẩu" },
    { label: "Mã số thuế" },
    { label: "Số hộ dùng chung", type: "number", placeholder: "0" },
  ];

  const selectFieldContent = [
    {
      label: "Giới tính",
      options: [
        { key: "male", label: "Nam" },
        { key: "female", label: "Nữ" },
      ],
      defaultKey: "male",
    },
    {
      label: "Loại khách hàng",
      options: [
        { key: "family", label: "Gia đình" },
        { key: "business", label: "Doanh nghiệp" },
      ],
      defaultKey: "family",
    },
  ];

  return (
    <div className="space-y-6">
      <h2
        className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
      >
        Thông tin khách hàng
      </h2>
      <div className="space-y-4">
        {mainInputContent.slice(0, 2).map((item, index) => (
          <div key={index} className="space-y-1">
            <CustomInput
              isRequired={item.isRequired}
              label={item.label}
              type={item.type}
              value={item.placeholder}
            />
          </div>
        ))}

        {selectFieldContent.map((item, index) => (
          <div key={index} className="space-y-1">
            <CustomSelect
              defaultSelectedKeys={
                item.defaultKey ? new Set([item.defaultKey]) : undefined
              }
              label={item.label}
              options={item.options.map((opt) => ({
                label: opt.label,
                value: opt.key,
              }))}
            />
          </div>
        ))}

        {mainInputContent.slice(2).map((item, index) => (
          <div key={index} className="space-y-1">
            <CustomInput
              isRequired={item.isRequired}
              label={item.label}
              type={item.type}
              value={item.placeholder}
            />
          </div>
        ))}

        <div className="space-y-2 pt-2">
          <CustomSelect
            label="Mục đích sử dụng"
            options={[
              { value: "sinh-hoat", label: "Sinh hoạt" },
              { value: "kinh-doanh", label: "Kinh doanh" },
              { value: "san-xuat", label: "Sản xuất" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
