// app/customer-registration/components/address-info.tsx
"use client";

import React from "react";
import { Divider } from "@heroui/react";

import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { TitleDarkColor } from "@/config/chip-and-icon";
import { CreateCustomerPayload } from "@/types";

interface AddressInfoProps {
  formData: CreateCustomerPayload;
  onUpdate: (field: keyof CreateCustomerPayload, value: any) => void;
}

export const AddressInfo = ({ formData, onUpdate }: AddressInfoProps) => {
  return (
    <div>
      <div className="space-y-6 pb-6 border-b border-gray-100 dark:border-divider">
        <h2
          className={`text-sm font-bold ${TitleDarkColor} uppercase tracking-wider`}
        >
          Địa chỉ & vị trí chi tiết
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <CustomInput
            label="Điểm đấu nối, khối thủy"
            value={formData.connectionPoint}
            onValueChange={(value) => onUpdate("connectionPoint", value)}
          />
        </div>
      </div>
      <Divider className="mt-6 mb-6" />
    </div>
  );
};
