"use client";

import { FormFieldRenderer } from "../form-field-renderer";
import { bankInfoFields } from "./bank-info.fields";


export const BankInfoSection = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        Thông tin thanh toán
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {bankInfoFields.map((f) => (
          <FormFieldRenderer key={f.key} field={f} />
        ))}
      </div>
    </div>
  );
};
