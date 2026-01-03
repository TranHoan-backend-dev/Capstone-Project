"use client";

import { customerInfoFields } from "./customer-info.fields";
import { FormFieldRenderer } from "../form-field-renderer";

export const CustomerInfoSection = () => (
  <div className="space-y-6">
    <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">
      Thông tin khách hàng
    </h2>

    <div className="space-y-4">
      {customerInfoFields.map((field) => (
        <FormFieldRenderer key={field.key} field={field} />
      ))}
    </div>
  </div>
);
