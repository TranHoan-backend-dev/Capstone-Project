"use client";

import React from "react";

import { TitleDarkColor } from "@/config/chip-and-icon";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";

import {
  NewInstallationFormPayload,
  NewInstallationFormProps,
  FormField,
} from "@/types";

export const CustomerInfoSection = ({
  formData,
  updateField,
}: NewInstallationFormProps) => {
  const fields: FormField[] = [
    {
      type: "input",
      key: "customerName",
      label: "Họ tên khách hàng",
      required: true,
    },
    {
      type: "input",
      key: "representative",
      label: "Người đại diện",
    },
    {
      type: "input",
      key: "citizenIdentificationNumber",
      label: "Số CCCD/CMND",
      required: true,
    },
    {
      type: "date",
      key: "citizenIdentificationProvideDate",
      label: "Ngày cấp CCCD/CMND",
      required: true,
    },
    {
      type: "select",
      key: "citizenIdentificationProvideLocation",
      label: "Nơi cấp CCCD/CMND",
      required: true,
      options: [
        { key: "Cục Cảnh sát quản lý hành chính về trật tự xã hội", label: "Cục Cảnh sát quản lý hành chính về trật tự xã hội" },
        { key: "Phòng Cảnh sát quản lý hành chính về trật tự xã hội", label: "Phòng Cảnh sát quản lý hành chính về trật tự xã hội" },
        { key: "Đội Cảnh sát quản lý hành chính về trật tự xã hội", label: "Đội Cảnh sát quản lý hành chính về trật tự xã hội" },
      ],
    },
    {
      type: "input",
      key: "taxCode",
      label: "Mã số thuế",
    },
    {
      type: "select",
      key: "customerType",
      label: "Loại khách hàng",
      required: true,
      options: [
        { key: "FAMILY", label: "Hộ gia đình" },
        { key: "COMPANY", label: "Công ty" },
      ],
    },
  ];

  const renderField = (field: FormField) => {
    const value = formData[field.key as keyof NewInstallationFormPayload];

    if (field.type === "input") {
      return (
        <CustomInput
          key={field.key}
          label={field.label}
          isRequired={field.required}
          value={
            field.key === "representative"
              ? (formData.representative?.[0]?.name ?? "")
              : String(
                  formData[field.key as keyof NewInstallationFormPayload] ?? "",
                )
          }
          onChange={(e) => {
            const value = e.target.value;

            if (field.key === "representative") {
              updateField("representative", [{ name: value }]);
            } else {
              updateField(field.key as keyof NewInstallationFormPayload, value);
            }
          }}
        />
      );
    }

    if (field.type === "date") {
      return (
        <CustomInput
          key={field.key}
          type="date"
          label={field.label}
          isRequired={field.required}
          value={String(value ?? "")}
          onChange={(e) =>
            updateField(
              field.key as keyof NewInstallationFormPayload,
              e.target.value,
            )
          }
        />
      );
    }

    if (field.type === "select") {
      return (
        <CustomSelect
          key={field.key}
          label={field.label}
          options={
            field.options?.map((o) => ({
              value: o.key,
              label: o.label,
            })) ?? []
          }
          selectedKeys={new Set([String(value ?? "")])}
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0];
            updateField(field.key as keyof NewInstallationFormPayload, val);
          }}
        />
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <h2
        className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
      >
        Thông tin khách hàng
      </h2>

      <div className="space-y-4">{fields.map(renderField)}</div>
    </div>
  );
};
