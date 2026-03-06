"use client";

import React, { useState, useEffect } from "react";
import { CallToast } from "@/components/ui/CallToast";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { Card, CardBody } from "@heroui/react";
import { DepartmentFormProps } from "@/types";
import { authFetch } from "@/utils/authFetch";

export const DepartmentForm = ({
  initialData,
  onSuccess,
  onClose,
}: DepartmentFormProps) => {
  const isEdit = !!initialData?.id;

  const [name, setName] = useState(initialData?.name || "");
  const [phoneNumber, setPhoneNumber] = useState(
    initialData?.phoneNumber || "",
  );
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    setName(initialData?.name || "");
    setPhoneNumber(initialData?.phoneNumber || "");
  }, [initialData]);

  const handleSubmit = async () => {
    if (submitLoading) return;
    try {
      setSubmitLoading(true);
      const phoneRegex = /^0[0-9]{9}$/;

      if (!phoneRegex.test(phoneNumber)) {
        CallToast({
          title: "Lỗi",
          message: "Số điện thoại phải bắt đầu bằng 0 và gồm đúng 10 chữ số",
          color: "danger",
        });
        return;
      }
      const url = isEdit
        ? `/api/organization/departments/${initialData?.id}`
        : `/api/organization/departments`;

      const method = isEdit ? "PUT" : "POST";

      const payload = {
        name,
        phoneNumber,
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
          : "Thêm mới phòng ban thành công!",
        color: "success",
      });
      onSuccess();
    } catch (e: any) {
      let message = e.message || "Có lỗi xảy ra";
      if (message === "Phone number already exists") {
        message = "Số điện thoại đã tồn tại";
      }

      if (message === "Name already exists") {
        message = "Tên phòng ban đã tồn tại";
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
            {isEdit ? "Cập nhật Phòng ban" : "Thêm mới Phòng ban"}
          </h2>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="Tên phòng ban"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <CustomInput
              label="Số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
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
              isDisabled={!name.trim() || !phoneNumber.trim() || submitLoading}
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
