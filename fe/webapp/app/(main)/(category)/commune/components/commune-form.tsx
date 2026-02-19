"use client";

import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { Card, CardBody } from "@heroui/react";
import React, { useState } from "react";

interface CreateNetworkFormProps {
  onSuccess: () => void;
}

export const CommuneForm = ({ onSuccess }: CreateNetworkFormProps) => {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/construction/networks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Create failed");

      setName("");
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
            Thêm mới chi nhánh cấp nước
          </h2>
        </div>

        <div className="px-6 py-5 space-y-5">
          <CustomInput
            label="Tên chi nhánh"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
