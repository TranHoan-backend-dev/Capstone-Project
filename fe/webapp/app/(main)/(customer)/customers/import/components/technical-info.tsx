"use client";

import { Checkbox, Divider } from "@heroui/react";
import React from "react";
import { parseDate } from "@internationalized/date";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { TitleDarkColor } from "@/config/chip-and-icon";
import { TechnicalInfoProps } from "@/types";

export const TechnicalInfo = ({ formData, onUpdate }: TechnicalInfoProps) => {
  const parseDateString = (dateString: string) => {
    if (!dateString) return null;
    try {
      return parseDate(dateString);
    } catch {
      return null;
    }
  };
  return (
    <div>
      <div className="space-y-6 pb-6 border-b border-gray-100 dark:border-divider">
        <h2
          className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
        >
          Thông số kỹ thuật & định mức
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <CustomSelect
          label="Loại khách hàng"
          options={[
            { value: "FAMILY", label: "Hộ gia đình" },
            { value: "COMPANY", label: "Công ty" },
            // { value: "GOVERNMENT", label: "Cơ quan hành chính" },
            // { value: "PRODUCTION", label: "Sản xuất" },
            // { value: "BUSINESS", label: "Kinh doanh dịch vụ" },
          ]}
          selectedKeys={
            formData.type ? new Set([formData.type.toUpperCase()]) : new Set()
          }
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            onUpdate("type", value);
          }}
        />

        <CustomSelect
          label="Mục đích sử dụng"
          options={[
            { value: "DOMESTIC", label: "Sinh hoạt" },
            { value: "INDUSTRIAL", label: "Công nghiệp" },
            { value: "COMMERCIAL", label: "Thương mại" },
            { value: "ADMINISTRATIVE", label: "Hành chính sự nghiệp" },
          ]}
          selectedKeys={
            formData.usageTarget ? new Set([formData.usageTarget]) : new Set()
          }
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            onUpdate("usageTarget", value);
          }}
        />

        <CustomSelect
          label="Loại đồng hồ"
          options={[
            { value: "MECHANICAL", label: "Cơ khí" },
            { value: "ELECTRONIC", label: "Điện tử" },
            { value: "SMART", label: "Thông minh" },
          ]}
          selectedKeys={
            formData.waterMeterType
              ? new Set([formData.waterMeterType])
              : new Set()
          }
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            onUpdate("waterMeterType", value);
          }}
        />

        <CustomInput
          label="Số hộ"
          type="number"
          value={formData.numberOfHouseholds?.toString()}
          onChange={(e) =>
            onUpdate("numberOfHouseholds", parseInt(e.target.value))
          }
        />

        <CustomInput
          label="Số nhân khẩu"
          type="number"
          value={formData.householdRegistrationNumber?.toString()}
          onChange={(e) =>
            onUpdate("householdRegistrationNumber", parseInt(e.target.value))
          }
        />

        <CustomInput
          label="Phí bảo vệ môi trường"
          type="number"
          value={formData.protectEnvironmentFee?.toString()}
          onChange={(e) =>
            onUpdate("protectEnvironmentFee", parseInt(e.target.value))
          }
        />

        <CustomInput
          label="Giá cố định"
          value={formData.fixRate}
          onChange={(e) => onUpdate("fixRate", e.target.value)}
        />

        <CustomInput
          label="Phí lắp đặt"
          type="number"
          value={formData.installationFee?.toString()}
          onChange={(e) =>
            onUpdate("installationFee", parseInt(e.target.value))
          }
        />

        <CustomInput
          label="Tiền thuê hàng tháng"
          type="number"
          value={formData.monthlyRent?.toString()}
          onChange={(e) => onUpdate("monthlyRent", parseInt(e.target.value))}
        />

        <CustomInput
          label="Điểm đấu nối"
          value={formData.connectionPoint}
          onChange={(e) => onUpdate("connectionPoint", e.target.value)}
        />

        <div className="flex items-center gap-6 pt-4 md:col-span-2">
          <Checkbox
            size="sm"
            color="primary"
            isSelected={formData.isBigCustomer}
            onValueChange={(checked) => onUpdate("isBigCustomer", checked)}
          >
            Khách hàng lớn
          </Checkbox>

          <Checkbox
            size="sm"
            color="primary"
            isSelected={formData.isFree}
            onValueChange={(checked) => onUpdate("isFree", checked)}
          >
            Không tính tiền
          </Checkbox>

          <Checkbox
            size="sm"
            color="primary"
            isSelected={formData.isSale}
            onValueChange={(checked) => onUpdate("isSale", checked)}
          >
            Khuyến mãi
          </Checkbox>
        </div>
      </div>
      <Divider className="mt-6 mb-6" />
    </div>
  );
};
