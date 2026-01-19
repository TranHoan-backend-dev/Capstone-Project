"use client";

import { FormFieldRenderer } from "../form-field-renderer";

import { supplementaryInfoFields } from "./supplementary-info.fields";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";

export const SupplementaryInfoSection = () => {
  return (
    <GenericSearchFilter
      title="Thông tin phụ"
      gridClassName="grid grid-cols-3 gap-4"
      isCollapsible
      actions={<></>}
    >
      {supplementaryInfoFields.map((f) => (
        <div key={f.key} className={f.colSpan ? `col-span-${f.colSpan}` : ""}>
          <FormFieldRenderer field={f} />
        </div>
      ))}
    </GenericSearchFilter>
  );
};
