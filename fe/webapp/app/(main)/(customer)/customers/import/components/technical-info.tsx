"use client";

import { Checkbox, Divider } from "@heroui/react";
import React from "react";

import CustomInput from "@/components/ui/custom/CustomInput";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { TitleDarkColor } from "@/config/chip-and-icon";

export const TechnicalInfo = () => {
  return (
    <div>
      <div className="space-y-6 pb-6 border-b border-gray-100 dark:border-divider">
        <h2
          className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
        >
          Hợp đồng & thông số kỹ thuật
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CustomInput label="Số hợp đồng" />
        <CustomInput label="Mã đồng hồ" />
        <CustomDatePicker label="Ngày hợp đồng" />
        <CustomDatePicker label="Ngày lắp đặt" />
        <CustomInput label="Số hợp đồng lắp đặt" />
        <CustomDatePicker label="Ngày hợp đồng lắp đặt" />

        <CustomSelect
          label="Loại khách hàng"
          defaultSelectedKeys={["sh"]}
          options={[
            {
              label: "Sinh hoạt",
              value: "sh",
            },
          ]}
        />
        <CustomSelect
          label="Mục đích sử dụng"
          defaultSelectedKeys={["sh"]}
          options={[
            {
              label: "Sinh hoạt",
              value: "sh",
            },
          ]}
        />
        <CustomInput label="Số hộ" type="number" defaultValue="1" />
        <CustomInput label="Số nhân khẩu" type="number" defaultValue="1" />
        <CustomSelect
          label="Bảng giá"
          defaultSelectedKeys={["bg1"]}
          options={[
            {
              label: "Bảng giá 1",
              value: "bg1",
            },
          ]}
        />
        <CustomSelect
          label="Tính phí bảo vệ môi trường đặc biệt"
          defaultSelectedKeys={["0"]}
          options={[
            {
              label: "0%",
              value: "0",
            },
            {
              label: "10%",
              value: "10",
            },
          ]}
        />

        <SearchInputWithButton label="Lộ trình ghi" />
        <SearchInputWithButton label="Loại đồng hồ" />
        <CustomInput label="Chỉ số đồng hồ" type="number" defaultValue="0" />
        <CustomInput label="Định mức" type="number" defaultValue="0" />
        <CustomSelect
          label="Kích cỡ"
          defaultSelectedKeys={["dn15"]}
          options={[
            {
              label: "DN15",
              value: "dn15",
            },
            {
              label: "DN20",
              value: "dn20",
            },
            {
              label: "DN25",
              value: "dn25",
            },
          ]}
        />
        <div className="flex items-center h-full pt-4">
          <Checkbox size="sm" color="primary">
            Khách hàng lớn
          </Checkbox>
        </div>
      </div>
      <Divider className="mt-6 mb-6" />
    </div>
  );
};
