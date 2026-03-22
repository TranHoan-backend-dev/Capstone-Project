"use client";

import React, { useState, useEffect } from "react";
import { CallToast } from "@/components/ui/CallToast";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { Card, CardBody } from "@heroui/react";
import { WaterPriceFormProps } from "@/types";
import { authFetch } from "@/utils/authFetch";
import CustomSelect from "@/components/ui/custom/CustomSelect";

const typeOptions = [
  { value: "DOMESTIC", label: "Sinh hoạt" },
  { value: "INSTITUTIONAL", label: "Cơ quan / HCSN" },
  { value: "INDUSTRIAL", label: "Sản xuất" },
  { value: "COMMERCIAL", label: "Kinh doanh dịch vụ" },
];
export const WaterPriceForm = ({
  initialData,
  onSuccess,
  onClose,
}: WaterPriceFormProps) => {
  const isEdit = !!initialData?.id;

  const [usageTarget, setUsageTarget] = useState("");
  const [tax, setTax] = useState("");
  const [environmentPrice, setEnvironmentPrice] = useState("");
  const [applicationPeriod, setApplicationPeriod] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setUsageTarget(initialData.usageTarget || "");
      setTax(initialData.tax || "");
      setEnvironmentPrice(initialData.environmentPrice || "");
      setApplicationPeriod(initialData.applicationPeriod || "");
      setExpirationDate(initialData.expirationDate || "");
      setDescription(initialData.description || "");
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (submitLoading) return;

    const trimmedUsageTarget = usageTarget.trim();

    if (!trimmedUsageTarget) {
      CallToast({
        title: "Lỗi",
        message: "Loại sử dụng không được để trống",
        color: "danger",
      });
      return;
    }

    try {
      setSubmitLoading(true);

      const url = isEdit
        ? `/api/device/water-prices/${initialData?.id}`
        : `/api/device/water-prices`;

      const method = isEdit ? "PUT" : "POST";

      const payload = {
        usageTarget: trimmedUsageTarget,
        tax,
        environmentPrice,
        applicationPeriod,
        expirationDate,
        description,
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
          : "Thêm mới giá nước thành công!",
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
            {isEdit ? "Cập nhật giá nước" : "Thêm mới giá nước"}
          </h2>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 gap-6">
            <CustomSelect
              label="Mục đích sử dụng"
              selectedKeys={usageTarget ? [usageTarget] : []}
              onSelectionChange={(keys) =>
                setUsageTarget(Array.from(keys)[0] as string)
              }
              options={typeOptions}
            />

            <CustomInput
              label="Thuế"
              value={tax}
              onChange={(e) => setTax(e.target.value)}
            />

            <CustomInput
              label="Phí môi trường"
              value={environmentPrice}
              onChange={(e) => setEnvironmentPrice(e.target.value)}
            />

            <CustomInput
              label="Thời gian áp dụng"
              type="date"
              value={applicationPeriod}
              onChange={(e) => setApplicationPeriod(e.target.value)}
            />

            <CustomInput
              label="Ngày hết hạn"
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />

            <CustomInput
              label="Mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-4">
            <CustomButton variant="light" onPress={onClose}>
              Huỷ
            </CustomButton>

            <CustomButton
              className="text-white bg-green-500 hover:bg-green-600 mr-2"
              startContent={
                submitLoading ? null : <CheckApprovalIcon className="w-4 h-4" />
              }
              onPress={handleSubmit}
              isLoading={submitLoading}
              isDisabled={!usageTarget.trim()}
            >
              {submitLoading ? "Đang lưu..." : "Lưu"}
            </CustomButton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
