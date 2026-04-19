"use client";

import React, { useState } from "react";

import { TitleDarkColor } from "@/config/chip-and-icon";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import {
  NewInstallationFormProps,
  NewInstallationFormPayload,
  FormField,
} from "@/types";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { LookupModal } from "@/components/ui/modal/LookupModal";

export const AddressContactSection = ({
  formData,
  updateField,
}: NewInstallationFormProps) => {
  const normalizeBankAccountNumber = (value: string) =>
    value.replace(/\D/g, "").slice(0, 16);

  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [selectedNetworkId, setSelectedNetworkId] = useState("");
  const [selectedNetworkName, setSelectedNetworkName] = useState("");

  const [showOverallModal, setShowOverallModal] = useState(false);
  const [selectedOverallId, setSelectedOverallId] = useState("");
  const [selectedOverallName, setSelectedOverallName] = useState("");

  const fields: FormField[] = [
    {
      type: "input",
      key: "address",
      label: "Địa chỉ lắp đặt",
      required: true,
    },
    {
      type: "input",
      key: "phoneNumber",
      label: "Điện thoại liên hệ",
      required: true,
    },
    {
      type: "search-input",
      key: "networkId",
      label: "Chi nhánh cấp nước",
      onSearchClick: () => setShowNetworkModal(true),
    },
    {
      type: "search-input",
      key: "overallWaterMeterId",
      label: "Đồng hồ nước tổng",
      onSearchClick: () => setShowOverallModal(true),
    },
  ];

  const bankFields: FormField[] = [
    {
      type: "input",
      key: "bankAccountNumber",
      label: "Số tài khoản ngân hàng",
      required: true,
    },
    {
      type: "input",
      key: "bankAccountProviderLocation",
      label: "Ngân hàng và chi nhánh",
      required: true,
    },
  ];

  const renderField = (field: FormField) => {
    if (field.type === "input") {
      return (
        <CustomInput
          key={field.key}
          label={field.label}
          isRequired={field.required}
          maxLength={field.key === "bankAccountNumber" ? 16 : undefined}
          value={String(
            formData[field.key as keyof NewInstallationFormPayload] ?? "",
          )}
          onChange={(e) =>
            updateField(
              field.key as keyof NewInstallationFormPayload,
              field.key === "bankAccountNumber"
                ? normalizeBankAccountNumber(e.target.value)
                : e.target.value,
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
          options={field.options.map((o) => ({
            label: o.label,
            value: o.key,
          }))}
          selectedKeys={
            new Set([
              String(
                formData[field.key as keyof NewInstallationFormPayload] ?? "",
              ),
            ])
          }
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0];
            updateField(field.key as keyof NewInstallationFormPayload, value);
          }}
        />
      );
    }

    if (field.type === "search-input") {
      const value =
        field.key === "networkId" ? selectedNetworkName : selectedOverallName;

      return (
        <React.Fragment key={field.key}>
          <SearchInputWithButton
            label={field.label}
            value={value}
            onSearch={field.onSearchClick}
            onChange={() => {
              if (field.key === "networkId") {
                setSelectedNetworkId("");
                setSelectedNetworkName("");
                updateField("networkId", "");
              }

              if (field.key === "overallWaterMeterId") {
                setSelectedOverallId("");
                setSelectedOverallName("");
                updateField("overallWaterMeterId", "");
              }
            }}
          />

          {field.key === "networkId" && (
            <LookupModal
              dataKey="content"
              isOpen={showNetworkModal}
              onClose={() => setShowNetworkModal(false)}
              title="Chọn chi nhánh cấp nước"
              api="/api/construction/networks"
              searchKey="keyword"
              columns={[
                { key: "stt", label: "STT" },
                { key: "name", label: "Tên chi nhánh" },
              ]}
              mapData={(item, index) => ({
                stt: index + 1,
                id: item.branchId,
                name: item.name,
              })}
              onSelect={(item) => {
                setSelectedNetworkId(item.id);
                setSelectedNetworkName(item.name);
                updateField("networkId", item.id);
              }}
            />
          )}

          {field.key === "overallWaterMeterId" && (
            <LookupModal
              dataKey="content"
              isOpen={showOverallModal}
              onClose={() => setShowOverallModal(false)}
              title="Chọn đồng hồ nước tổng"
              api="/api/device/water-meters/overall"
              searchKey="keyword"
              columns={[
                { key: "stt", label: "STT" },
                { key: "name", label: "Tên đồng hồ" },
              ]}
              mapData={(item, index) => ({
                stt: index + 1,
                id: item.serial,
                name: item.name,
              })}
              onSelect={(item) => {
                setSelectedOverallId(item.id);
                setSelectedOverallName(item.name);
                updateField("overallWaterMeterId", item.id);
              }}
            />
          )}
        </React.Fragment>
      );
    }

    return null;
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

        <div className="space-y-4">{bankFields.map(renderField)}</div>
      </div>
    </div>
  );
};
