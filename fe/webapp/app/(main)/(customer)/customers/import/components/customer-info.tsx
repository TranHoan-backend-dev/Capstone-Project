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
import { CallToast } from "@/components/ui/CallToast";

export const CustomerInfo = ({ formData, onUpdate }: CustomerInfoProps) => {
  const [showFormModal, setShowFormModal] = useState(false);

  const [showWaterPriceModal, setShowWaterPriceModal] = useState(false);
  const [displayWaterPrice, setDisplayWaterPrice] = useState("");

  const [showWaterMeterModal, setShowWaterMeterModal] = useState(false);
  const [displayWaterMeter, setDisplayWaterMeter] = useState("");

  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [displayRoadmap, setDisplayRoadmap] = useState("");

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

  useEffect(() => {
    const fetchRoadmapDetails = async () => {
      if (formData.roadmapId && !displayRoadmap) {
        try {
          const response = await authFetch(
            `/api/construction/roadmaps/${formData.roadmapId}`,
          );
          const result = await response.json();
          if (result.data) {
            setDisplayRoadmap(
              `${result.data.name} - ${result.data.lateralName} - ${result.data.networkName}`,
            );
          }
        } catch (error) {
          console.error("Failed to fetch roadmap:", error);
        }
      }
    };

    fetchRoadmapDetails();
  }, [formData.roadmapId, displayRoadmap]);

  // Add handler for roadmap selection:
  const handleSelectRoadmap = (item: any) => {
    onUpdate("roadmapId", item.id);
    setDisplayRoadmap(`${item.lateralName} - ${item.networkName}`);
    setShowRoadmapModal(false);
  };

  const handleSelectForm = async (selectedForm: any) => {
    try {
      onUpdate("formNumber", selectedForm.formNumber);
      onUpdate("formCode", selectedForm.formCode);

      if (selectedForm.customerName) {
        onUpdate("name", selectedForm.customerName);
      }

      if (selectedForm.address) {
        onUpdate("address", selectedForm.address);
      }

      if (selectedForm.phoneNumber) {
        onUpdate("phoneNumber", selectedForm.phoneNumber);
      }

      if (selectedForm.email) {
        onUpdate("email", selectedForm.email);
      }

      if (selectedForm.citizenIdentificationNumber) {
        onUpdate(
          "citizenIdentificationNumber",
          selectedForm.citizenIdentificationNumber,
        );
      }

      if (selectedForm.citizenIdentificationProvideLocation) {
        onUpdate(
          "citizenIdentificationProvideLocation",
          selectedForm.citizenIdentificationProvideLocation,
        );
      }

      if (selectedForm.overallWaterMeterId) {
        onUpdate("waterMeterId", selectedForm.overallWaterMeterId);
        fetchWaterMeterDetailsById(selectedForm.overallWaterMeterId);
      }
      if (selectedForm.customerType) {
        onUpdate("type", selectedForm.customerType);
      }

      if (selectedForm.usageTarget) {
        onUpdate("usageTarget", selectedForm.usageTarget);
      }

      if (selectedForm.taxCode) {
        onUpdate("taxCode", selectedForm.taxCode);
      }

      if (selectedForm.householdRegistrationNumber) {
        onUpdate(
          "householdRegistrationNumber",
          selectedForm.householdRegistrationNumber,
        );
      }

      if (selectedForm.numberOfHousehold) {
        onUpdate("numberOfHouseholds", selectedForm.numberOfHousehold);
      }

      if (selectedForm.bankAccountNumber) {
        onUpdate("bankAccountNumber", selectedForm.bankAccountNumber);
      }

      if (selectedForm.bankAccountProviderLocation) {
        onUpdate(
          "bankAccountProviderLocation",
          selectedForm.bankAccountProviderLocation,
        );
      }

      setShowFormModal(false);
    } catch (error) {
      console.error("Failed to process form data:", error);
    }
  };
  const fetchWaterMeterDetailsById = async (waterMeterId: string) => {
    try {
      const response = await authFetch(
        `/api/device/water-meters/${waterMeterId}`,
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
            { key: "customerName", label: "Tên khách hàng" },
            { key: "address", label: "Địa chỉ" },
            { key: "phoneNumber", label: "Số điện thoại" },
          ]}
          mapData={(item: any, index: number) => ({
            stt: index + 1,
            id: item.formCode,
            // Thông tin cơ bản
            formNumber: item.formNumber,
            formCode: item.formCode,
            customerName: item.customerName,
            address: item.address,
            phoneNumber: item.phoneNumber,
            email: item.email,

            // Thông tin CCCD
            citizenIdentificationNumber: item.citizenIdentificationNumber,
            citizenIdentificationProvideDate:
              item.citizenIdentificationProvideDate,
            citizenIdentificationProvideLocation:
              item.citizenIdentificationProvideLocation,

            // Thông tin bổ sung
            customerType: item.customerType,
            usageTarget: item.usageTarget,
            taxCode: item.taxCode,
            householdRegistrationNumber: item.householdRegistrationNumber,
            numberOfHousehold: item.numberOfHousehold,
            scheduleSurveyAt: item.scheduleSurveyAt,
            registrationAt: item.registrationAt,

            // Thông tin ngân hàng
            bankAccountNumber: item.bankAccountNumber,
            bankAccountProviderLocation: item.bankAccountProviderLocation,
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
          label="Địa chỉ"
          isRequired
          value={formData.address}
          onValueChange={(value) => onUpdate("address", value)}
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
          value={formData.citizenIdentificationProvideLocation}
          onValueChange={(value) =>
            onUpdate("citizenIdentificationProvideLocation", value)
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
        <SearchInputWithButton
          label="Lộ trình ghi"
          isRequired
          value={displayRoadmap}
          onValueChange={() => {}}
          onSearch={() => setShowRoadmapModal(true)}
        />
        <LookupModal
          enableSearch={false}
          dataKey="content"
          isOpen={showRoadmapModal}
          onClose={() => setShowRoadmapModal(false)}
          title="Chọn lộ trình ghi"
          api="/api/construction/roadmaps"
          columns={[
            { key: "stt", label: "STT" },
            { key: "name", label: "Tên lộ trình" },
            { key: "lateralName", label: "Nhánh tổng" },
            { key: "networkName", label: "Chi nhánh" },
          ]}
          mapData={(item: any, index: number) => ({
            stt: index + 1,
            id: item.roadmapId,
            name: item.name,
            lateralName: item.lateralName,
            networkName: item.networkName,
          })}
          onSelect={handleSelectRoadmap}
        />
      </div>
      <Divider className="mt-6 mb-6" />
    </div>
  );
};
