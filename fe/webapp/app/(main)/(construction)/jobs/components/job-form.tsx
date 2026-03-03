"use client";

import { CallToast } from "@/components/ui/CallToast";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { NetworksFormProps } from "@/types";
import { Card, CardBody } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { useIsITStaff } from "@/hooks/useHasRole";

export const NetworkForm = ({
  initialData,
  onSuccess,
  onClose,
}: NetworksFormProps) => {
  const { isITStaff } = useIsITStaff();
  const [name, setName] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const isEdit = !!initialData?.id;

  useEffect(() => {
    setName(initialData?.name || "");
  }, [initialData]);

  const handleSubmit = async () => {
    if (submitLoading) return;
    try {
      setSubmitLoading(true);

      const url = isEdit
        ? `/api/construction/networks/${initialData?.id}`
        : `/api/construction/networks`;

      const method = isEdit ? "PUT" : "POST";

      const payload = {
        name: !isEdit || name !== initialData?.name ? name.trim() : "",
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
        message: "Lưu chi nhánh cấp nước thành công",
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
            {isEdit
              ? "Cập nhật chi nhánh cấp nước"
              : "Thêm mới chi nhánh cấp nước"}
          </h2>
        </div>

        <div className="px-6 py-5 space-y-5">
          <CustomInput
            label="Tên chi nhánh"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
              isDisabled={!name.trim() || !isITStaff}
            >
              {submitLoading ? "Đang lưu..." : "Lưu"}
            </CustomButton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
