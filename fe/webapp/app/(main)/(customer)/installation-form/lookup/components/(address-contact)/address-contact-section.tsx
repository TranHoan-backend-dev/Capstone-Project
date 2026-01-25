"use client";

import { FormFieldRenderer } from "../form-field-renderer";

import { addressContactFields } from "./address-contact.fields";
import { bankInfoFields } from "./bank-info.field";

import { TitleDarkColor } from "@/config/chip-and-icon";

export const AddressContactSection = () => (
  <div className="space-y-4">
    <div className="space-y-6 pb-6 border-b border-gray-100 dark:border-divider">
      <h2
        className={`text-sm font-bold text-blue-600 uppercase tracking-wider ${TitleDarkColor}`}
      >
        Địa chỉ & liên hệ
      </h2>

      <div className="space-y-4">
        {addressContactFields.map((field) => (
          <FormFieldRenderer key={field.key} field={field} />
        ))}
      </div>
    </div>

    <div className="space-y-4">
      <h2
        className={`text-sm font-bold text-blue-600 uppercase tracking-wider ${TitleDarkColor}`}
      >
        Thông tin ngân hàng
      </h2>
      <div className="space-y-4">
        {bankInfoFields.map((field) => (
          <FormFieldRenderer key={field.key} field={field} />
        ))}
      </div>
    </div>
  </div>
);
