"use client";

import { FormFieldRenderer } from "../form-field-renderer";
import { supplementaryInfoFields } from "./supplementary-info.fields";

export const SupplementaryInfoSection = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Thông tin phụ</h2>

      <div className="grid grid-cols-3 gap-4">
        {supplementaryInfoFields.map((f) => (
          <div key={f.key} className={f.colSpan ? `col-span-${f.colSpan}` : ""}>
            <FormFieldRenderer field={f} />
          </div>
        ))}
      </div>
    </div>
  );
};
