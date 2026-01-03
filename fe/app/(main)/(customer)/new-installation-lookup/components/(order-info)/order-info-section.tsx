"use client";

import { orderInfoFields } from "./order-info.fields";
import { FormFieldRenderer } from "../form-field-renderer";

export const OrderInfoSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">
        Thông tin đơn
      </h2>

      <div className="space-y-4">
        {orderInfoFields.map((field) => (
          <FormFieldRenderer key={field.key} field={field} />
        ))}
      </div>
    </div>
  );
};
