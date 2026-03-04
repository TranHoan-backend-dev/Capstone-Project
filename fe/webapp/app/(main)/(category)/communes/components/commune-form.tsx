"use client";

import React, { useState, useEffect } from "react";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { Card, CardBody } from "@heroui/react";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { CommuneFormProps } from "@/types";
import { CallToast } from "@/components/ui/CallToast";
import { authFetch } from "@/utils/authFetch";

const typeOptions = [
  { label: "Phường", value: "URBAN_WARD" },
  { label: "Xã", value: "RURAL_COMMUNE" },
];

export const CommuneForm = ({
  initialData,
  onSuccess,
  onClose,
}: CommuneFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [type, setType] = useState(initialData?.type || "");
  const [submitLoading, setSubmitLoading] = useState(false);
  const isEdit = !!initialData?.id;

  useEffect(() => {
    setName(initialData?.name || "");
    setType(initialData?.type || "");
  }, [initialData]);

  const handleSubmit = async () => {
    if (submitLoading) return;
    try {
      setSubmitLoading(true);
      const url = isEdit
        ? `/api/construction/communes/${initialData?.id}`
        : `/api/construction/communes`;

      const method = isEdit ? "PUT" : "POST";

      const payload = {
        name: name.trim(),
        type: type.toUpperCase(),
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
          : "Thêm mới phường/xã thành công!",
        color: "success",
      });
      onSuccess();
    } catch (e: any) {
      CallToast({
        title: "Lỗi",
        message: e?.message || "Có lỗi xảy ra khi lưu thông tin!",
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
            {isEdit ? "Cập nhật Phường/Xã" : "Thêm mới Phường/Xã"}
          </h2>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label="Tên phường/xã"
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
              isDisabled={!name.trim() || !type}
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
