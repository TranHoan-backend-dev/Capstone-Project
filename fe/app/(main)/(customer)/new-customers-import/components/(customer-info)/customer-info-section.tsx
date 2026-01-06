"use client";

import { FormFieldRenderer } from "../form-field-renderer";
import { customerInfoFields } from "./customer-info.fields";


export const CustomerInfoSection = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        Thông tin đơn & Định danh
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {customerInfoFields.map((f) => (
          <FormFieldRenderer key={f.key} field={f} />
        ))}
      </div>
    </div>
  );
};
