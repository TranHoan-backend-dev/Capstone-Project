"use client";

import React, { useState, useEffect } from "react";
import { CallToast } from "@/components/ui/CallToast";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { Card, CardBody } from "@heroui/react";
import { MaterialGroupFormProps, UnitFormProps } from "@/types";
import { authFetch } from "@/utils/authFetch";
import { validateBranchName } from "@/utils/validation";

export const MaterialsGroupForm = ({
  initialData,
  onSuccess,
  onClose,
}: MaterialGroupFormProps) => {
  const isEdit = !!initialData?.id;

  const [name, setName] = useState(initialData?.name || "");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    setName(initialData?.name || "");
  }, [initialData]);

  const handleSubmit = async () => {
    if (submitLoading) return;

    const trimmedName = name.trim();
    const error = validateBranchName(name, "Tên nhóm vật tư");

    if (error) {
      CallToast({
        title: "Lỗi",
        message: error,
        color: "danger",
      });
      return;
    }
    try {
      setSubmitLoading(true);
      const url = isEdit
        ? `/api/device/materials-group/${initialData?.id}`
        : `/api/device/materials-group`;

      const method = isEdit ? "PUT" : "POST";

      const payload = { name: trimmedName };

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
          : "Thêm mới nhóm vật tư thành công!",
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
            {isEdit ? "Cập nhật Nhóm vật tư" : "Thêm mới Nhóm vật tư"}
          </h2>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <CustomInput
              label="Tên nhóm vật tư"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              isDisabled={!name.trim()}
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
