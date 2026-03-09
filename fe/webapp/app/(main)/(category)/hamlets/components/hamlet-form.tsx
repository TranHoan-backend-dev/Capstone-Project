"use client";

import React, { useState, useEffect } from "react";
import { CallToast } from "@/components/ui/CallToast";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { Card, CardBody } from "@heroui/react";
import { useCommune } from "@/hooks/useCommunes";
import { HamletFormProps } from "@/types";
import { authFetch } from "@/utils/authFetch";

const typeOptions = [
  { label: "Thôn", value: "HAMLET" },
  { label: "Làng", value: "VILLAGE" },
];

export const HamletForm = ({
  initialData,
  onSuccess,
  onClose,
}: HamletFormProps) => {
  const isEdit = !!initialData?.id;

  const [name, setName] = useState(initialData?.name || "");
  const [type, setType] = useState(initialData?.type || "");
  const [submitLoading, setSubmitLoading] = useState(false);

  const [selectedCommune, setSelectedCommune] = useState<Set<string>>(
    new Set(),
  );

  const { communeOptions, loading: communeLoading } = useCommune();

  useEffect(() => {
    setName(initialData?.name || "");
  }, [initialData]);

  useEffect(() => {
    if (initialData?.communeId && communeOptions.length > 0) {
      setSelectedCommune(new Set([initialData.communeId]));
    } else {
      setSelectedCommune(new Set());
    }
  }, [initialData, communeOptions]);

  const handleSubmit = async () => {
    if (submitLoading) return;
    try {
      setSubmitLoading(true);
      const url = isEdit
        ? `/api/construction/hamlets/${initialData?.id}`
        : `/api/construction/hamlets`;

      const method = isEdit ? "PUT" : "POST";

      const selectedCommuneId = Array.from(selectedCommune)[0] || "";

      const payload = {
        name: !isEdit || name !== initialData?.name ? name.trim() : "",
        type: !isEdit || type !== initialData?.type ? type : "",
        communeId:
          !isEdit || selectedCommuneId !== initialData?.communeId
            ? selectedCommuneId
            : "",
      };

      const response = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Save failed");
      }
      CallToast({
        title: "Thành công",
        message: isEdit
          ? "Cập nhật thành công!"
          : "Thêm mới thôn làng thành công!",
        color: "success",
      });
      onSuccess();
    } catch (e: any) {
      let message = e.message || "Có lỗi xảy ra";
      if (message.includes("Hamlet with name")) {
        const name = message.match(/name (.*?) already exists/)?.[1];
        message = `Thôn/làng "${name}" đã tồn tại`;
      }
      CallToast({
        title: "Lỗi",
        message: message,
        color: "danger",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Card shadow="sm" className="rounded-2xl border border-divider bg-content1">
      <CardBody className="p-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
          <h2 className="text-base font-semibold text-foreground">
            {isEdit ? "Cập nhật Thôn/làng" : "Thêm mới Thôn/làng"}
          </h2>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomInput
              label="Tên thôn/làng"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <CustomSelect
              label="Loại"
              selectedKeys={type ? [type] : []}
              onSelectionChange={(keys) =>
                setType(Array.from(keys)[0] as string)
              }
              options={typeOptions}
            />
            <CustomSelect
              label="Phường/xã"
              options={communeOptions}
              selectedKeys={selectedCommune}
              onSelectionChange={(keys) => setSelectedCommune(keys)}
            />
          </div>
          <div className="flex justify-end gap-4">
            <CustomButton variant="light" onPress={onClose}>
              Huỷ
            </CustomButton>
            <CustomButton
              className="text-white bg-green-500 hover:bg-green-600 dark:shadow-md dark:shadow-success/40 mr-2"
              startContent={
                submitLoading ? null : <CheckApprovalIcon className="w-4 h-4" />
              }
              onPress={handleSubmit}
              isDisabled={
                !name.trim() || communeLoading || !type || !selectedCommune.size
              }
              isLoading={submitLoading}
            >
              {submitLoading ? "Đang lưu..." : "Lưu"}
            </CustomButton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
