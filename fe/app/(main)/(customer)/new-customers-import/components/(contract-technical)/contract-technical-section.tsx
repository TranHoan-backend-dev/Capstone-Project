"use client";

import { FormFieldRenderer } from "../form-field-renderer";
import { contractFields } from "./contract-technical.fields";


export const ContractTechnicalSection = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">
        Hợp đồng & Thông số kỹ thuật
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {contractFields.map((f) => (
          <FormFieldRenderer key={f.key} field={f} />
        ))}
      </div>
    </div>
  );
};
