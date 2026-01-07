"use client";

import { customerInfoFields } from "./customer-info.fields";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import CustomInput from "@/components/ui/custom/CustomInput";

export const CustomerInfoSection = () => {
  return (
    <GenericSearchFilter
      title="Thông tin đơn & Định danh"
      gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3"
      isCollapsible
      actions={<></>}
    >
      {customerInfoFields.map((field, idx) => (
        <div key={idx} className="space-y-1">
          <CustomInput key={field.key} label={field.label} />
        </div>
      ))}
    </GenericSearchFilter>
  );
};
