"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/react";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { CallToast } from "@/components/ui/CallToast";
import { NeighborhoodUnitFormProps } from "@/types";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { useCommune } from "@/hooks/useCommunes";

export const NeighborhoodUnitForm = ({
  initialData,
  onSuccess,
  onClose,
}: NeighborhoodUnitFormProps) => {
  const isEdit = !!initialData?.id;

  const [name, setName] = useState(initialData?.name || "");
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
        ? `/api/construction/neighborhood-units/${initialData?.id}`
        : `/api/construction/neighborhood-units`;

      const method = isEdit ? "PUT" : "POST";

      const selectedCommuneId = Array.from(selectedCommune)[0];

      const payload = {
        name: name.trim(),
        communeId: selectedCommuneId,
      };

      const response = await fetch(url, {
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
          : "Thêm mới tổ/khu phố thành công!",
        color: "success",
      });
      onSuccess();
    } catch (e: any) {
      CallToast({
        title: "Lỗi",
        message: e.message || "Có lỗi xảy ra",
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
            {isEdit ? "Cập nhật Tổ/Khu phố" : "Thêm mới Tổ/Khu phố"}
          </h2>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="Tên tổ/khu phố"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              isDisabled={!name.trim() || communeLoading}
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
