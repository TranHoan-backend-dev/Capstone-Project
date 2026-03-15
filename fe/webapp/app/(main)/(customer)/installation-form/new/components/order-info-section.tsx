"use client";

import React from "react";

import { TitleDarkColor } from "@/config/chip-and-icon";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
interface Props {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
}
export const OrderInfoSection = ({ formData, updateField }: any) => {
  const inputFields = [
    {
      type: "input",
      name: "formCode",
      label: "Mã biểu mẫu",
      required: true,
    },
    { type: "input", name: "formNumber", label: "Số hồ sơ", required: true },
    { label: "Số hộ sử dụng", name: "numberOfHousehold" },
    { label: "Số nhân khẩu", name: "householdRegistrationNumber" },
    { label: "Mục đích sử dụng", name: "usageTarget" },
  ];

  const dateFields = [
    { label: "Ngày nhận đơn", name: "receivedFormAt", isRequired: true },
    { label: "Ngày hẹn khảo sát", name: "scheduleSurveyAt" },
  ];

  return (
    <div className="space-y-6">
      <h2
        className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
      >
        Thông tin đơn
      </h2>
      <div className="space-y-4">
        {inputFields
          .filter((item) => item.name !== "usageTarget")
          .map((item, index) => (
            <div key={index} className="space-y-1">
              <CustomInput
                label={item.label}
                value={String(formData[item.name] ?? "")}
                onChange={(e) => updateField(item.name, e.target.value)}
              />
            </div>
          ))}
        <CustomSelect
          label="Mục đích sử dụng"
          options={[
            { value: "DOMESTIC", label: "Sinh hoạt" },
            { value: "COMMERCIAL", label: "Kinh doanh" },
            { value: "INDUSTRIAL", label: "Sản xuất" },
            { value: "INSTITUTIONAL", label: "Cơ quan" },
          ]}
          selectedKeys={new Set([formData.usageTarget])}
          onSelectionChange={(keys) =>
            updateField("usageTarget", Array.from(keys)[0])
          }
        />
        {dateFields.map((item, index) => (
          <div key={index} className="space-y-1">
            <CustomInput
              type="date"
              label={item.label}
              value={formData[item.name]}
              onChange={(e) => updateField(item.name, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
