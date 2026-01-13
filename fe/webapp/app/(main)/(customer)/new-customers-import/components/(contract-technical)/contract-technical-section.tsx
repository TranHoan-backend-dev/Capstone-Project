"use client";

import { FormFieldRenderer } from "../form-field-renderer";

import { contractFields } from "./contract-technical.fields";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";

export const ContractTechnicalSection = () => {
  return (
    <GenericSearchFilter
      title="Hợp đồng & Thông số kỹ thuật"
      gridClassName="grid grid-cols-3 gap-4"
      isCollapsible
      actions={<></>}
    >
      {contractFields.map((f) => (
        <FormFieldRenderer key={f.key} field={f} />
      ))}
    </GenericSearchFilter>
  );
};
