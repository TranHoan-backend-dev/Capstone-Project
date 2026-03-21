"use client";

import React, { useEffect, useState } from "react";
import { Checkbox, Divider } from "@heroui/react";

import CustomInput from "@/components/ui/custom/CustomInput";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import { TitleDarkColor } from "@/config/chip-and-icon";
import { CustomerInfoProps, usageTargetMap } from "@/types";
import { LookupModal } from "@/components/ui/modal/LookupModal";
import { authFetch } from "@/utils/authFetch";

export const CustomerInfo = ({ formData, onUpdate }: CustomerInfoProps) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [showWaterPriceModal, setShowWaterPriceModal] = useState(false);
  const [displayWaterPrice, setDisplayWaterPrice] = useState("");
  const [showWaterMeterModal, setShowWaterMeterModal] = useState(false);
  const [displayWaterMeter, setDisplayWaterMeter] = useState("");

  useEffect(() => {
    const fetchWaterPriceDetails = async () => {
      if (formData.waterPriceId && !displayWaterPrice) {
        try {
          const response = await authFetch(
            `/api/device/water-prices/${formData.waterPriceId}`,
          );
          const result = await response.json();
          if (result.data) {
            setDisplayWaterPrice(
              `${result.data.tax}% - ${result.data.environmentPrice}`,
            );
          }
        } catch (error) {
          console.error("Failed to fetch water price:", error);
        }
      }
    };

    fetchWaterPriceDetails();
  }, [formData.waterPriceId, displayWaterPrice]);

  useEffect(() => {
    const fetchWaterMeterDetails = async () => {
      if (formData.waterMeterId && !displayWaterMeter) {
        try {
          const response = await authFetch(
            `/api/device/water-meters/${formData.waterMeterId}`,
          );
          const result = await response.json();
          if (result.data) {
            setDisplayWaterMeter(
              `Loại: ${result.data.typeName} - Size: ${result.data.size} - Lắp: ${result.data.installationDate}`,
            );
          }
        } catch (error) {
          console.error("Failed to fetch water meter:", error);
        }
      }
    };

    fetchWaterMeterDetails();
  }, [formData.waterMeterId, displayWaterMeter]);

  const handleSelectForm = (form: { formNumber: string; formCode: string }) => {
    onUpdate("formNumber", form.formNumber);
    onUpdate("formCode", form.formCode);
    setShowFormModal(false);
  };

  const handleSelectWaterPrice = (item: any) => {
    onUpdate("waterPriceId", item.id);
    setDisplayWaterPrice(
      `${item.usageTarget} - ${item.tax}% - ${item.environmentPrice}`,
    );
    setShowWaterPriceModal(false);
  };

  const handleSelectWaterMeter = (item: any) => {
    onUpdate("waterMeterId", item.id);
    setDisplayWaterMeter(
      `Loại: ${item.typeName} - Size: ${item.size} - Lắp: ${item.installationDate}`,
    );
    setShowWaterMeterModal(false);
  };

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
          label="Số đơn"
          isRequired
          value={formData.formNumber}
          onValueChange={(value) => onUpdate("formNumber", value)}
          onSearch={() => setShowFormModal(true)}
        />
        <CustomInput
          label="Mã đơn"
          type="hidden"
          isRequired
          value={formData.formCode}
          onValueChange={(value) => onUpdate("formCode", value)}
        />
        <LookupModal
          enableSearch={false}
          dataKey="content"
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          title="Chọn Mã đơn"
          api="/api/construction/installation-forms"
          columns={[
            { key: "stt", label: "STT" },
            { key: "formNumber", label: "Mã đơn" },
          ]}
          mapData={(item: any, index: number) => ({
            stt: index + 1,
            id: item.formCode,
            formNumber: item.formNumber,
            formCode: item.formCode,
          })}
          onSelect={handleSelectForm}
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
        <SearchInputWithButton
          label="Bảng giá nước"
          isRequired
          value={displayWaterPrice}
          onValueChange={() => {}}
          onSearch={() => setShowWaterPriceModal(true)}
        />
        <LookupModal
          enableSearch={false}
          dataKey="content"
          isOpen={showWaterPriceModal}
          onClose={() => setShowWaterPriceModal(false)}
          title="Chọn bảng giá nước"
          api="/api/device/water-prices"
          columns={[
            { key: "stt", label: "STT" },
            { key: "usageTarget", label: "Mục đích sử dụng" },
            { key: "tax", label: "Thuế (%)" },
            { key: "environmentPrice", label: "Phí môi trường" },
            { key: "applicationPeriod", label: "Kỳ áp dụng" },
          ]}
          mapData={(item: any, index: number) => ({
            stt: index + 1,
            id: item.id,
            usageTarget: usageTargetMap[item.usageTarget] || item.usageTarget,
            tax: item.tax,
            environmentPrice: item.environmentPrice,
            applicationPeriod: item.applicationPeriod,
          })}
          onSelect={handleSelectWaterPrice}
        />
        <SearchInputWithButton
          label="Đồng hồ nước"
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
          title="Chọn đồng hồ nước"
          api="/api/device/water-meters"
          columns={[
            { key: "stt", label: "STT" },
            { key: "typeName", label: "Loại đồng hồ" },
            { key: "size", label: "Cỡ đồng hồ" },
            { key: "installationDate", label: "Ngày lắp đặt" },
          ]}
          mapData={(item: any, index: number) => ({
            stt: index + 1,
            id: item.id,
            typeName: item.typeName,
            size: item.size,
            installationDate: item.installationDate,
          })}
          onSelect={handleSelectWaterMeter}
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
