"use client";

import React from "react";

import { TitleDarkColor } from "@/config/chip-and-icon";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { NewInstallationFormProps, NewInstallationFormPayload } from "@/types";

type FieldConfig =
  | {
      type: "input";
      label: string;
      name: keyof NewInstallationFormPayload;
      isRequired?: boolean;
    }
  | {
      type: "select";
      label: string;
      name: keyof NewInstallationFormPayload;
      isRequired?: boolean;
      options: { label: string; value: string }[];
    };

export const AddressContactSection = ({
  formData,
  updateField,
}: NewInstallationFormProps) => {
  const fields: FieldConfig[] = [
    {
      type: "input",
      label: "Địa chỉ lắp đặt",
      name: "address",
      isRequired: true,
    },
    {
      type: "input",
      label: "Điện thoại liên hệ",
      name: "phoneNumber",
      isRequired: true,
    },
    {
      type: "select",
      label: "Chi nhánh cấp nước",
      name: "networkId",
      options: [{ value: "3ac28a8e-c3a1-4d94-9708-3354437e39f1", label: "Chi nhánh 1" }],
    },
    {
      type: "select",
      label: "Đồng hồ nước tổng",
      name: "overallWaterMeterId",
      options: [{ value: "00000000-0000-0000-0000-400000000001", label: "Đồng hồ 1" }],
    },
  ];

  const bankFields: FieldConfig[] = [
    {
      type: "input",
      label: "Số tài khoản ngân hàng",
      name: "bankAccountNumber",
      isRequired: true,
    },
    {
      type: "input",
      label: "Ngân hàng và chi nhánh",
      name: "bankAccountProviderLocation",
      isRequired: true,
    },
  ];

  const renderField = (field: FieldConfig) => {
    if (field.type === "input") {
      return (
        <CustomInput
          key={field.name}
          label={field.label}
          isRequired={field.isRequired}
          value={String(formData[field.name] ?? "")}
          onChange={(e) => updateField(field.name, e.target.value)}
        />
      );
    }

    return (
      <CustomSelect
        key={field.name}
        label={field.label}
        isRequired={field.isRequired}
        options={field.options}
        selectedKeys={new Set([String(formData[field.name] ?? "")])}
        onSelectionChange={(keys) => {
          const value = Array.from(keys)[0];
          updateField(field.name, value);
        }}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6 pb-6 border-b border-gray-100 dark:border-divider">
        <h2
          className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
        >
          Địa chỉ lắp đặt & Liên hệ
        </h2>

        <div className="space-y-4">{fields.map(renderField)}</div>
      </div>

      <div className="space-y-4 py-2">
        <h2
          className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
        >
          Thông tin ngân hàng
        </h2>

        <div className="space-y-4">
          {bankFields.map(renderField)}
        </div>
      </div>
    </div>
  );
};
