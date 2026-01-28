"use client";

import { FormFieldRenderer } from "../form-field-renderer";

import { orderInfoFields } from "./order-info.fields";

import { TitleDarkColor } from "@/config/chip-and-icon";

export const OrderInfoSection = () => {
  return (
    <div className="space-y-6">
      <h2
        className={`text-sm font-bold uppercase tracking-wider ${TitleDarkColor}`}
      >
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
