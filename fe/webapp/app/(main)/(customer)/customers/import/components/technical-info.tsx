"use client";

import { Checkbox, Divider } from "@heroui/react";
import React, { useEffect, useState } from "react";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { TitleDarkColor } from "@/config/chip-and-icon";
import { TechnicalInfoProps } from "@/types";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { LookupModal } from "@/components/ui/modal/LookupModal";
import { authFetch } from "@/utils/authFetch";

export const TechnicalInfo = ({ formData, onUpdate }: TechnicalInfoProps) => {
  const [showWaterMeterModal, setShowWaterMeterModal] = useState(false);
  const [displayWaterMeter, setDisplayWaterMeter] = useState("");

  useEffect(() => {
    const fetchWaterMeterDetails = async () => {
      if (formData.waterMeterType && !displayWaterMeter) {
        try {
          const response = await authFetch(
            `/api/device/water-meter-type/${formData.waterMeterType}`,
          );
          const result = await response.json();
          if (result.data) {
            setDisplayWaterMeter(
              `${result.data.name} - ${result.data.origin} - ${result.data.meterModel}`,
            );
          }
        } catch (error) {
          console.error("Failed to fetch water meter:", error);
        }
      }
    };
    fetchWaterMeterDetails();
  }, [formData.waterMeterType]);

  const handleSelectWaterMeterType = (item: any) => {
    onUpdate("waterMeterType", item.id);
    setDisplayWaterMeter(
      `${item.name} - ${item.origin} - ${item.meterModel}`,
    );
    setShowWaterMeterModal(false);
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
        <SearchInputWithButton
          label="Loại đồng hồ nước"
          isRequired
          value={displayWaterMeter}
          onValueChange={() => {}}
          onSearch={() => setShowWaterMeterModal(true)}
        />
        <LookupModal
          enableSearch={false}
          dataKey="content"
          isOpen={showWaterMeterModal}
          onClose={() => setShowWaterMeterModal(false)}
          title="Chọn loại đồng hồ nước"
          api="/api/device/water-meter-type"
          columns={[
            { key: "stt", label: "STT" },
            { key: "name", label: "Tên" },
            { key: "origin", label: "Nguồn gốc" },
            { key: "meterModel", label: "Loại" },
          ]}
          mapData={(item: any, index: number) => ({
            stt: index + 1,
            id: item.typeId,
            name: item.name,
            origin: item.origin,
            meterModel: item.meterModel,
          })}
          onSelect={handleSelectWaterMeterType}
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
            isSelected={formData.isActive}
            onValueChange={(checked) => onUpdate("isActive", checked)}
          >
            Kích hoạt
          </Checkbox>

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
