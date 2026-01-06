"use client";

import { FormFieldRenderer } from "../form-field-renderer";
import { addressFields } from "./address.fields";

export const AddressSection = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Địa chỉ & vị trí chi tiết</h2>

      <div className="grid grid-cols-3 gap-4">
        {addressFields.map((f) => (
          <div
            key={f.key}
            className={f.type === "textarea" ? "col-span-3" : ""}
          >
            <FormFieldRenderer field={f} />
          </div>
        ))}
      </div>
    </div>
  );
};
