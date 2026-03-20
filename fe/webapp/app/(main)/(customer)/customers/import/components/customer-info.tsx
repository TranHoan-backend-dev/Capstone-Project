"use client";

import React from "react";
import { Checkbox, Divider } from "@heroui/react";

import CustomInput from "@/components/ui/custom/CustomInput";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import { TitleDarkColor } from "@/config/chip-and-icon";
import { CreateCustomerPayload } from "@/types";

interface CustomerInfoProps {
  formData: CreateCustomerPayload;
  onUpdate: (field: keyof CreateCustomerPayload, value: any) => void;
}

export const CustomerInfo = ({ formData, onUpdate }: CustomerInfoProps) => {
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
        <SearchInputWithButton
          label="Mã đơn"
          isRequired
          value={formData.formNumber}
          onValueChange={(value) => onUpdate("formNumber", value)}
        />
        <CustomInput
          label="Mã form"
          isRequired
          value={formData.formCode}
          onValueChange={(value) => onUpdate("formCode", value)}
        />
        <CustomInput
          label="Tên khách hàng"
          isRequired
          value={formData.name}
          onValueChange={(value) => onUpdate("name", value)}
        />
        <CustomInput
          label="Email"
          type="email"
          value={formData.email}
          onValueChange={(value) => onUpdate("email", value)}
        />
        <CustomInput
          label="Số điện thoại"
          value={formData.phoneNumber}
          onValueChange={(value) => onUpdate("phoneNumber", value)}
        />
        <CustomInput
          label="Số CCCD"
          value={formData.citizenIdentificationNumber}
          onValueChange={(value) =>
            onUpdate("citizenIdentificationNumber", value)
          }
        />
        <CustomInput
          label="Nơi cấp CCCD"
          value={formData.citizenIdentificationProvideAt}
          onValueChange={(value) =>
            onUpdate("citizenIdentificationProvideAt", value)
          }
        />
        <CustomInput
          label="Mã số Quan hệ ngân sách"
          value={formData.budgetRelationshipCode}
          onValueChange={(value) => onUpdate("budgetRelationshipCode", value)}
        />
        <CustomInput
          label="Mã Hộ Chiếu"
          value={formData.passportCode}
          onValueChange={(value) => onUpdate("passportCode", value)}
        />
        <CustomInput
          label="Mã bảng giá nước"
          isRequired
          value={formData.waterPriceId}
          onValueChange={(value) => onUpdate("waterPriceId", value)}
        />
        <CustomInput
          label="Mã đồng hồ nước"
          isRequired
          value={formData.waterMeterId}
          onValueChange={(value) => onUpdate("waterMeterId", value)}
        />
        <div className="flex items-center h-full pt-4">
          <Checkbox
            size="sm"
            color="primary"
            isSelected={formData.isActive}
            onValueChange={(checked) => onUpdate("isActive", checked)}
          >
            Kích hoạt
          </Checkbox>
        </div>
      </div>
      <Divider className="mt-6 mb-6" />
    </div>
  );
};
