"use client";

import { FormFieldRenderer } from "../form-field-renderer";

import { bankInfoFields } from "./bank-info.fields";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";

export const BankInfoSection = () => {
  return (
    <GenericSearchFilter
      title="Thông tin thanh toán"
      gridClassName="grid grid-cols-3 gap-4"
      isCollapsible
      actions={<></>}
    >
      {bankInfoFields.map((f) => (
        <FormFieldRenderer key={f.key} field={f} />
      ))}
    </GenericSearchFilter>
  );
};
