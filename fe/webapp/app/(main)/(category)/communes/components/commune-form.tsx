"use client";

import React, { useState, useEffect } from "react";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { Card, CardBody } from "@heroui/react";
import CustomSelect from "@/components/ui/custom/CustomSelect";

interface CommuneFormProps {
  initialData?: {
    id?: string;
    name: string;
    type?: string;
  };
  onSuccess: () => void;
}

const typeOptions = [
  { label: "Phường (Đô thị)", value: "URBAN_WARD" },
  { label: "Xã (Nông thôn)", value: "RURAL_COMMUNE" },
];

export const CommuneForm = ({ initialData, onSuccess }: CommuneFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [type, setType] = useState(initialData?.type || "");
  const isEdit = !!initialData?.id;

  useEffect(() => {
    setName(initialData?.name || "");
    setType(initialData?.type || "");
  }, [initialData]);

  const handleSubmit = async () => {
    try {
      const url = isEdit
        ? `/api/construction/communes/${initialData?.id}`
        : `/api/construction/communes`;
      const method = isEdit ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type }),
      });
      if (!response.ok) throw new Error("Save failed");
      onSuccess();
    } catch (e) {
      console.error(e);
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
          <CustomInput
            label="Tên chi nhánh"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="md:col-span-2">
            <CustomSelect
              label="Loại"
              selectedKeys={type ? [type] : []}
              onSelectionChange={(keys) =>
                setType(Array.from(keys)[0] as string)
              }
              options={typeOptions}
            />
          </div>
          <div className="flex justify-end">
            <CustomButton
              className="text-white bg-green-500 hover:bg-green-600 dark:shadow-md dark:shadow-success/40 mr-2"
              startContent={<CheckApprovalIcon className="w-4 h-4" />}
              onPress={handleSubmit}
              isDisabled={!name.trim()}
            >
              Lưu
            </CustomButton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
