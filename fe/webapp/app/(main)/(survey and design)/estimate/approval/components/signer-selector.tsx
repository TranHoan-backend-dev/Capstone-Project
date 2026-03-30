"use client";

import React from "react";

interface Employee {
  id: string;
  fullName: string;
  departmentName?: string;
}

interface SignerSelectorProps {
  label: string;
  value: string;
  employees: Employee[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const SignerSelector = ({
  label,
  value,
  employees,
  onChange,
  placeholder = "-- Chọn --",
}: SignerSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <select
        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.fullName}{" "}
            {employee.departmentName ? `(${employee.departmentName})` : ""}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SignerSelector;
