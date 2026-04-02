"use client";

import React, { useState, useEffect } from "react";
import { CallToast } from "@/components/ui/CallToast";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { Card, CardBody } from "@heroui/react";
import { ParameterFormProps } from "@/types";
import { authFetch } from "@/utils/authFetch";

export const ParameterForm = ({
  initialData,
  onSuccess,
  onClose,
}: ParameterFormProps) => {
  const isEdit = !!initialData?.id;

  const [name, setName] = useState(initialData?.name || "");
  const [value, setValue] = useState(
    initialData?.value !== undefined ? String(initialData.value) : "",
  );
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    setName(initialData?.name || "");
    setValue(initialData?.value !== undefined ? String(initialData.value) : "");
  }, [initialData]);

  const handleSubmit = async () => {
    if (submitLoading) return;
    try {
      if (!initialData?.id) return;

      setSubmitLoading(true);

      const url = `/api/device/parameters/${initialData.id}`;
      const method = "PUT";
      const numericValue = Number(value);

      if (!value.trim() || isNaN(Number(value))) {
        CallToast({
          title: "Lỗi",
          message: "Giá trị phải là số hợp lệ",
          color: "danger",
        });
        return;
      }

      const payload: any = {};

      if (!isEdit || name !== initialData?.name) {
        payload.name = name;
      }
      if (!isEdit || value !== String(initialData?.value)) {
        payload.value = numericValue;
      }

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
        message: "Cập nhật thành công!",
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
            {"Cập nhật Tham số"}
          </h2>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="Tham số"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <CustomInput
              label="Giá trị"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
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
