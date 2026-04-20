"use client";

import React, { useEffect, useState } from "react";
import { Divider } from "@heroui/react";

import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { TitleDarkColor } from "@/config/chip-and-icon";
import { CustomerInfoProps, usageTargetMap } from "@/types";
import { LookupModal } from "@/components/ui/modal/LookupModal";
import { authFetch } from "@/utils/authFetch";
import { toAccountName } from "@/utils/validation";

export const CustomerInfo = ({ formData, onUpdate }: CustomerInfoProps) => {
  const [showFormModal, setShowFormModal] = useState(false);

  const [showWaterPriceModal, setShowWaterPriceModal] = useState(false);
  const [displayWaterPrice, setDisplayWaterPrice] = useState("");

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

  const syncContractAndEstimateMeter = async (
    formCode: string,
    formNumber: string,
  ) => {
    try {
      const [contractRes, meterRes] = await Promise.all([
        authFetch(
          `/api/customer/contracts/form/${encodeURIComponent(formCode)}`,
        ),
        authFetch(
          `/api/construction/estimates/meter-type/${encodeURIComponent(formCode)}`,
        ),
      ]);

      if (contractRes.ok) {
        const contractJson = await contractRes.json();
        const payload = contractJson?.data;
        const cid =
          payload && typeof payload === "object" && "contractId" in payload
            ? (payload as { contractId?: string }).contractId
            : undefined;
        if (cid) {
          onUpdate("contractId", cid);
        }
      }

      if (meterRes.ok) {
        const meterJson = await meterRes.json();
        const raw = meterJson?.data;
        const waterMeterType =
          raw !== undefined && raw !== null && String(raw).trim() !== ""
            ? String(raw)
            : null;
        if (waterMeterType) {
          onUpdate("waterMeterType", waterMeterType);
        }
      }
    } catch (error) {
      console.error("Failed to sync contract / estimate meter type:", error);
    }
  };

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
        onUpdate("bankAccountName", toAccountName(selectedForm.customerName));
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
          "citizenIdentificationProvideAt",
          selectedForm.citizenIdentificationProvideLocation,
        );
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

      if (selectedForm.formCode && selectedForm.formNumber) {
        await syncContractAndEstimateMeter(
          selectedForm.formCode,
          selectedForm.formNumber,
        );
      }

      if (selectedForm.formCode) {
        try {
          const estimateRes = await authFetch(
            `/api/construction/estimates/form-code/${encodeURIComponent(selectedForm.formCode)}`,
          );
          if (estimateRes.ok) {
            const estimateJson = await estimateRes.json();
            const serial = estimateJson?.data?.waterMeterId;
            if (serial) {
              onUpdate("waterMeterId", serial);
            }
          }
        } catch (error) {
          console.error(
            "Failed to fetch waterMeterId from estimate:",
            error,
          );
        }
      }

      setShowFormModal(false);
    } catch (error) {
      console.error("Failed to process form data:", error);
    }
  };
  const handleSelectWaterPrice = (item: any) => {
    onUpdate("waterPriceId", item.id);
    setDisplayWaterPrice(
      `${item.usageTarget} - ${item.tax}% - ${item.environmentPrice}`,
    );
    setShowWaterPriceModal(false);
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
          onSearch={async () => {
            const code = formData.formCode?.trim();
            if (code) {
              try {
                const res = await authFetch(
                  `/api/customer/contracts/form/${encodeURIComponent(code)}`,
                );
                if (res.ok) {
                  const json = await res.json();
                  const payload = json?.data;
                  const cid =
                    payload &&
                    typeof payload === "object" &&
                    "contractId" in payload
                      ? (payload as { contractId?: string }).contractId
                      : undefined;
                  if (cid) {
                    onUpdate("contractId", cid);
                  }
                }
              } catch (e) {
                console.error("Failed to prefetch contract by form code:", e);
              }
            }
            setShowFormModal(true);
          }}
        />
        <CustomInput
          label="Mã đơn"
          type="hidden"
          isRequired
          value={formData.formCode}
          onValueChange={(value) => onUpdate("formCode", value)}
        />
        <CustomInput
          label="contractId"
          type="hidden"
          value={formData.contractId ?? ""}
          onValueChange={(value) => onUpdate("contractId", value)}
        />
        <LookupModal
          enableSearch={false}
          dataKey="content"
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          title="Chọn Số đơn"
          api="/api/construction/installation-forms"
          columns={[
            { key: "stt", label: "STT" },
            { key: "formCode", label: "Mã đơn" },
            { key: "formNumber", label: "Số đơn" },
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

            overallWaterMeterId: item.overallWaterMeterId,
          })}
          onSelect={handleSelectForm}
        />
        <CustomInput
          label="Tên khách hàng"
          isRequired
          value={formData.name}
          onValueChange={(value) => {
            onUpdate("name", value);
            onUpdate("bankAccountName", toAccountName(value));
          }}
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
        <CustomSelect
          label="Nơi cấp CCCD"
          options={[
            {
              label: "Cục Cảnh sát quản lý hành chính về trật tự xã hội",
              value: "Cục Cảnh sát quản lý hành chính về trật tự xã hội",
            },
            {
              label: "Phòng Cảnh sát quản lý hành chính về trật tự xã hội",
              value: "Phòng Cảnh sát quản lý hành chính về trật tự xã hội",
            },
            {
              label: "Đội Cảnh sát quản lý hành chính về trật tự xã hội",
              value: "Đội Cảnh sát quản lý hành chính về trật tự xã hội",
            },
          ]}
          selectedKeys={
            formData.citizenIdentificationProvideAt
              ? new Set([formData.citizenIdentificationProvideAt])
              : new Set()
          }
          onSelectionChange={(keys) => {
            const selectedValue = Array.from(keys)[0] as string;
            onUpdate("citizenIdentificationProvideAt", selectedValue || "");
          }}
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
        <CustomInput
          label="Số serial đồng hồ"
          value={formData.waterMeterId ?? ""}
          onValueChange={(value) => onUpdate("waterMeterId", value)}
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
