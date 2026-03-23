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
import {
  FormField,
  NewInstallationFormPayload,
  NewInstallationFormProps,
} from "@/types";
type OrderField = {
  type?: "input";
  name: keyof NewInstallationFormPayload;
  label: string;
  isRequired?: boolean;
};
type DateField = {
  label: string;
  name: keyof NewInstallationFormPayload;
  isRequired?: boolean;
};
export const OrderInfoSection = ({
  formData,
  updateField,
}: NewInstallationFormProps) => {
  const inputFields: FormField[] = [
    {
      type: "input",
      key: "formCode",
      label: "Mã biểu mẫu",
      required: true,
    },
    { type: "input", key: "formNumber", label: "Số hồ sơ", required: true },
    {
      type: "input",
      key: "numberOfHousehold",
      label: "Số hộ sử dụng",
      required: true,
    },
    {
      type: "input",
      key: "householdRegistrationNumber",
      label: "Số nhân khẩu",
      required: true,
    },
  ];

  const dateFields: FormField[] = [
    {
      type: "date",
      label: "Ngày nhận đơn",
      key: "receivedFormAt",
      required: true,
    },
    {
      type: "date",
      label: "Ngày hẹn khảo sát",
      key: "scheduleSurveyAt",
      required: true,
    },
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
          .filter((item) => item.key !== "usageTarget")
          .map((item, index) => (
            <div key={index} className="space-y-1">
              <CustomInput
                label={item.label}
                value={String(
                  formData[item.key as keyof NewInstallationFormPayload] ?? "",
                )}
                onChange={(e) =>
                  updateField(
                    item.key as keyof NewInstallationFormPayload,
                    e.target.value,
                  )
                }
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
              value={String(
                formData[item.key as keyof NewInstallationFormPayload] ?? "",
              )}
              onChange={(e) =>
                updateField(
                  item.key as keyof NewInstallationFormPayload,
                  e.target.value,
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};
