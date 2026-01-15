"use client";

import { FormFieldRenderer } from "../form-field-renderer";

import { addressFields } from "./address.fields";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";

export const AddressSection = () => {
  return (
    <GenericSearchFilter
      title="Địa chỉ & vị trí chi tiết"
      gridClassName="grid grid-cols-3 gap-4"
      isCollapsible
      actions={<></>}
    >
      {addressFields.map((f) => (
        <div key={f.key} className={f.type === "textarea" ? "col-span-3" : ""}>
          <FormFieldRenderer field={f} />
        </div>
      ))}
    </GenericSearchFilter>
  );
};
