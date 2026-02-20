"use client";

import React, { useState, useEffect } from "react";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { Card, CardBody } from "@heroui/react";

interface RoadmapFormProps {
  initialData?: {
    id?: string;
    name: string;
    lateralName: string;
    networkName: string;
  };
  onSuccess: () => void;
  onClose: () => void;
}

export const RoadmapForm = ({ initialData, onSuccess, onClose }: RoadmapFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [loading, setLoading] = useState(false);
  const isEdit = !!initialData?.id;

  useEffect(() => {
    setName(initialData?.name || "");
  }, [initialData]);

  const handleSubmit = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const url = isEdit
        ? `/api/construction/roadmaps/${initialData?.id}`
        : `/api/construction/roadmaps`;

      const method = isEdit ? "PUT" : "POST";

      const payload = { name };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Save failed");
      }

      onSuccess();
      onClose();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="sm" className="rounded-2xl border border-divider bg-content1">
      <CardBody className="p-0">
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
          <h2 className="text-base font-semibold text-foreground">
            {isEdit ? "Cập nhật Lộ trình ghi" : "Thêm mới Lộ trình ghi"}
          </h2>
        </div>

        <div className="px-6 py-5 space-y-5">
          <CustomInput
            label="Tên lộ trình ghi"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex justify-end">
            <CustomButton variant="light" onPress={onClose}>
              Huỷ
            </CustomButton>
            <CustomButton
              className="text-white bg-green-500 hover:bg-green-600 dark:shadow-md dark:shadow-success/40 mr-2"
              startContent={<CheckApprovalIcon className="w-4 h-4" />}
              onPress={handleSubmit}
              isDisabled={!name.trim()}
              isLoading={loading}
            >
              Lưu
            </CustomButton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
