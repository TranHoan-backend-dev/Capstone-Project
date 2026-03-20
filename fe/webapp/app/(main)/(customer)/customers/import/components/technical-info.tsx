"use client";

import { Checkbox, Divider } from "@heroui/react";
import React from "react";
import { parseDate } from "@internationalized/date";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { TitleDarkColor } from "@/config/chip-and-icon";
import { CreateCustomerPayload } from "@/types";

interface TechnicalInfoProps {
  formData: CreateCustomerPayload;
  onUpdate: (field: keyof CreateCustomerPayload, value: any) => void;
}

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
        {/* Customer Type */}
        <CustomSelect
          label="Loại khách hàng"
          options={[
            { value: "FAMILY", label: "Hộ gia đình" },
            { value: "COMPANY", label: "Công ty" },
            { value: "GOVERNMENT", label: "Cơ quan hành chính" },
            { value: "PRODUCTION", label: "Sản xuất" },
            { value: "BUSINESS", label: "Kinh doanh dịch vụ" },
          ]}
          selectedKeys={formData.type ? new Set([formData.type]) : new Set()}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            onUpdate("type", value);
          }}
        />

        {/* Usage Target */}
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

        {/* Water Meter Type */}
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

        {/* Payment Method */}
        <CustomSelect
          label="Phương thức thanh toán"
          options={[
            { value: "CASH", label: "Tiền mặt" },
            { value: "BANK_TRANSFER", label: "Chuyển khoản" },
            { value: "QR_CODE", label: "Quét mã QR" },
          ]}
          selectedKeys={
            formData.paymentMethod
              ? new Set([formData.paymentMethod])
              : new Set()
          }
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string;
            onUpdate("paymentMethod", value);
          }}
        />

        {/* Household Info */}
        <CustomInput
          label="Số hộ"
          type="number"
          value={formData.numberOfHouseholds?.toString() || "1"}
          onChange={(e) =>
            onUpdate("numberOfHouseholds", parseInt(e.target.value) || 0)
          }
        />

        <CustomInput
          label="Số nhân khẩu"
          type="number"
          value={formData.householdRegistrationNumber?.toString() || "1"}
          onChange={(e) =>
            onUpdate(
              "householdRegistrationNumber",
              parseInt(e.target.value) || 0,
            )
          }
        />

        {/* Fees & Rates */}
        <CustomInput
          label="Phí bảo vệ môi trường"
          type="number"
          value={formData.protectEnvironmentFee?.toString() || "0"}
          onChange={(e) =>
            onUpdate("protectEnvironmentFee", parseInt(e.target.value) || 0)
          }
        />

        <CustomInput
          label="Giá cố định"
          value={formData.fixRate || "0"}
          onChange={(e) => onUpdate("fixRate", e.target.value)}
        />

        <CustomInput
          label="M3 khuyến mãi"
          value={formData.m3Sale || "0"}
          onChange={(e) => onUpdate("m3Sale", e.target.value)}
        />

        <CustomInput
          label="Phí lắp đặt"
          type="number"
          value={formData.installationFee?.toString() || "0"}
          onChange={(e) =>
            onUpdate("installationFee", parseInt(e.target.value) || 0)
          }
        />

        <CustomInput
          label="Tiền thuê hàng tháng"
          type="number"
          value={formData.monthlyRent?.toString() || "0"}
          onChange={(e) =>
            onUpdate("monthlyRent", parseInt(e.target.value) || 0)
          }
        />
        <CustomDatePicker
          label="Kỳ khấu trừ"
          value={parseDateString(formData.deductionPeriod)}
          onChange={(date) => {
            if (date) {
              // date là DateValue object từ HeroUI DatePicker
              const dateStr = `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
              onUpdate("deductionPeriod", dateStr);
            } else {
              onUpdate("deductionPeriod", "");
            }
          }}
        />

        {/* Connection Point */}
        <CustomInput
          label="Điểm đấu nối"
          value={formData.connectionPoint}
          onChange={(e) => onUpdate("connectionPoint", e.target.value)}
          className="md:col-span-2"
        />

        {/* Checkboxes */}
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
