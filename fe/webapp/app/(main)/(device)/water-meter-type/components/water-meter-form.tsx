"use client";

import React, { useState, useEffect } from "react";
import { CallToast } from "@/components/ui/CallToast";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { Card, CardBody } from "@heroui/react";
import { WaterMeterFormProps } from "@/types";
import { authFetch } from "@/utils/authFetch";
const fieldLabelMap: Record<string, string> = {
  name: "Tên loại đồng hồ",
  origin: "Nơi sản xuất",
  meterModel: "Kiểu đồng hồ",
  size: "Kích cỡ",
  maxIndex: "CSMax",
  diameter: "Đường kính",
  qn: "Qn",
  qt: "Qt",
  qmin: "Qmin",
  indexLength: "Số ký tự phần nguyên",
};
export const WaterMeterForm = ({
  initialData,
  onSuccess,
  onClose,
}: WaterMeterFormProps) => {
  const isEdit = !!initialData?.id;
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    origin: initialData?.origin || "",
    meterModel: initialData?.meterModel || "",
    size: initialData?.size || "",
    maxIndex: initialData?.maxIndex || "",
    diameter: initialData?.diameter || "",
    qn: initialData?.qn || "",
    qt: initialData?.qt || "",
    qmin: initialData?.qmin || "",
    indexLength: initialData?.indexLength || "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    setFormData({
      name: initialData?.name ?? "",
      origin: initialData?.origin ?? "",
      meterModel: initialData?.meterModel ?? "",
      size: initialData?.size ?? "",
      maxIndex: initialData?.maxIndex ?? "",
      diameter: initialData?.diameter ?? "",
      qn: initialData?.qn ?? "",
      qt: initialData?.qt ?? "",
      qmin: initialData?.qmin ?? "",
      indexLength: initialData?.indexLength ?? "",
    });
  }, [initialData]);

  const handleSubmit = async () => {
    if (submitLoading) return;
    try {
      setSubmitLoading(true);
      const numberFields = ["maxIndex", "diameter", "qn", "qt", "qmin"];

      for (const field of numberFields) {
        const value = formData[field as keyof typeof formData];

        if (value && isNaN(Number(value))) {
          CallToast({
            title: "Lỗi",
            message: `${fieldLabelMap[field]} phải là số`,
            color: "danger",
          });
          return;
        }
      }
      const value = formData.size;

      if (value && !Number.isInteger(Number(value))) {
        CallToast({
          title: "Lỗi",
          message: "Kích cỡ phải là số nguyên",
          color: "danger",
        });
        return;
      }
      const url = isEdit
        ? `/api/device/water-meter-type/${initialData?.id}`
        : `/api/device/water-meter-type`;

      const method = isEdit ? "PUT" : "POST";

      const payload = {
        name: formData.name,
        origin: formData.origin,
        meterModel: formData.meterModel,
        size: formData.size ? parseInt(formData.size, 10) : null,
        maxIndex: formData.maxIndex,
        diameter: formData.diameter ? parseFloat(formData.diameter) : null,
        qn: formData.qn,
        qt: formData.qt,
        qmin: formData.qmin,
        indexLength: formData.indexLength ? parseInt(formData.indexLength, 10) : null,
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
          : "Thêm mới loại đồng hồ thành công!",
        color: "success",
      });
      onSuccess();
    } catch (e: any) {
      let message = e.message || "Có lỗi xảy ra";

      if (message.includes("not a valid `java.lang.Integer`")) {
        message = "Giá trị nhập phải là số hợp lệ";
      }

      if (message.includes("Water meter type with name")) {
        const name = message.match(/name (.*?) already exists/)?.[1];
        message = `Loại đồng hồ "${name}" đã tồn tại`;
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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card shadow="sm" className="rounded-2xl border border-divider bg-content1">
      <CardBody className="p-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
          <h2 className="text-base font-semibold text-foreground">
            {isEdit
              ? "Cập nhật Loại đồng hồ nước"
              : "Thêm mới Loại đồng hồ nước"}
          </h2>
          <button
            onClick={onClose}
            className="text-default-400 hover:text-default-600 transition-colors"
            aria-label="Đóng"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomInput
              label="Tên loại đồng hồ"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <CustomInput
              label="Nơi sản xuất"
              value={formData.origin}
              onChange={(e) => handleChange("origin", e.target.value)}
            />
            <CustomInput
              label="Kiểu đồng hồ"
              value={formData.meterModel}
              onChange={(e) => handleChange("meterModel", e.target.value)}
            />
            <CustomInput
              label="Kích cỡ"
              value={formData.size}
              onChange={(e) => handleChange("size", e.target.value)}
            />
            <CustomInput
              label="CSMax"
              value={formData.maxIndex}
              onChange={(e) => handleChange("maxIndex", e.target.value)}
            />
            <CustomInput
              label="Đường kính"
              value={formData.diameter}
              onChange={(e) => handleChange("diameter", e.target.value)}
            />
            <CustomInput
              label="Qn"
              value={formData.qn}
              onChange={(e) => handleChange("qn", e.target.value)}
            />
            <CustomInput
              label="Qt"
              value={formData.qt}
              onChange={(e) => handleChange("qt", e.target.value)}
            />
            <CustomInput
              label="Qmin"
              value={formData.qmin}
              onChange={(e) => handleChange("qmin", e.target.value)}
            />
            <CustomInput
              label="Số ký tự phần nguyên"
              value={formData.indexLength}
              onChange={(e) => handleChange("indexLength", e.target.value)}
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
              isDisabled={!formData.name.trim() || submitLoading}
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
