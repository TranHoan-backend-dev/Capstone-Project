"use client";

import React from "react";

import { TitleDarkColor } from "@/config/chip-and-icon";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect, {
  SelectOption,
} from "@/components/ui/custom/CustomSelect";
import {
  NewInstallationFormPayload,
  NewInstallationFormProps,
  UsageTarget,
} from "@/types";
type FieldType = "input" | "select" | "date";

interface FieldConfig {
  type: FieldType;
  name: keyof NewInstallationFormPayload;
  label: string;
  required?: boolean;
  options?: SelectOption[];
}
export const CustomerInfoSection = ({
  formData,
  updateField,
}: NewInstallationFormProps) => {
  const fields: FieldConfig[] = [
    {
      type: "input",
      name: "customerName",
      label: "Họ tên khách hàng",
      required: true,
    },
    {
      type: "input",
      name: "representative",
      label: "Người đại diện",
      required: true,
    },
    {
      type: "input",
      name: "citizenIdentificationNumber",
      label: "Số CCCD/CMND",
      required: true,
    },
    {
      type: "date",
      name: "citizenIdentificationProvideDate",
      label: "Ngày cấp CCCD/CMND",
      required: true,
    },
    {
      type: "input",
      name: "citizenIdentificationProvideLocation",
      label: "Nơi cấp CCCD/CMND",
    },
    {
      type: "input",
      name: "taxCode",
      label: "Mã số thuế",
    },
    {
      type: "select",
      name: "customerType",
      label: "Loại khách hàng",
      options: [
        { value: "FAMILY", label: "Hộ gia đình" },
        { value: "COMPANY", label: "Công ty" },
      ],
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
        {fields.map((field) => {
          if (field.type === "input") {
            return (
              <CustomInput
                key={field.name}
                label={field.label}
                isRequired={field.required}
                value={String(formData[field.name] ?? "")}
                onChange={(e) => {
                  const value = e.target.value;

                  if (field.name === "representative") {
                    updateField(field.name, [{ name: value }]);
                  } else {
                    updateField(field.name, value);
                  }
                }}
              />
            );
          }
          
          if (field.type === "date") {
            return (
              <CustomInput
                key={field.name}
                type="date"
                label={field.label}
                isRequired={field.required}
                value={String(formData[field.name] ?? "")}
                onChange={(e) => updateField(field.name, e.target.value)}
              />
            );
          }

          if (field.type === "select") {
            return (
              <CustomSelect
                key={field.name}
                label={field.label}
                options={field.options ?? []}
                selectedKeys={new Set([String(formData[field.name] ?? "")])}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0];
                  updateField(field.name, value);
                }}
              />
            );
          }
        })}
      </div>
    </div>
  );
};
