"use client";

import React, { useState, useEffect } from "react";
import { CallToast } from "@/components/ui/CallToast";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { Card, CardBody } from "@heroui/react";
import { useNetwork } from "@/hooks/useNetworks";
import { LateralFormProps } from "@/types";
import { authFetch } from "@/utils/authFetch";

export const LateralForm = ({
  initialData,
  onSuccess,
  onClose,
}: LateralFormProps) => {
  const isEdit = !!initialData?.id;

  const [code, setCode] = useState(initialData?.code || "");
  const [name, setName] = useState(initialData?.name || "");
  const [submitLoading, setSubmitLoading] = useState(false);

  const [selectedNetwork, setSelectedNetwork] = useState<Set<string>>(
    new Set(),
  );

  const { networkOptions, loading: networkLoading } = useNetwork();

  useEffect(() => {
    setCode(initialData?.code || "");
    setName(initialData?.name || "");
  }, [initialData]);

  useEffect(() => {
    if (initialData?.networkId && networkOptions.length > 0) {
      setSelectedNetwork(new Set([initialData.networkId]));
    } else {
      setSelectedNetwork(new Set());
    }
  }, [initialData, networkOptions]);

  const handleSubmit = async () => {
    if (submitLoading) return;

    try {
      setSubmitLoading(true);

      const url = isEdit
        ? `/api/construction/laterals/${initialData?.id}`
        : `/api/construction/laterals`;

      const method = isEdit ? "PUT" : "POST";

      const selectedNetworkId = Array.from(selectedNetwork)[0] || "";

      const payload = {
        name: !isEdit || name !== initialData?.name ? name.trim() : "",

        networkId:
          !isEdit || selectedNetworkId !== initialData?.networkId
            ? selectedNetworkId
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
          : "Thêm mới nhánh tổng thành công!",
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
            {isEdit ? "Cập nhật Nhánh tổng" : "Thêm mới Nhánh tổng"}
          </h2>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1 flex flex-col gap-4">
              <CustomInput
                label="Mã nhánh tổng"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <CustomInput
                label="Tên nhánh tổng"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="md:col-span-1 flex flex-col gap-4">
              <CustomSelect
                label="Chi nhánh"
                options={networkOptions}
                selectedKeys={selectedNetwork}
                onSelectionChange={(keys) => setSelectedNetwork(keys)}
              />
            </div>
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
              isDisabled={
                !name.trim() || selectedNetwork.size === 0 || networkLoading
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
