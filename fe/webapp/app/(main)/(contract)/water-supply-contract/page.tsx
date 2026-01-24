"use client";

import { ContractForm } from "./components/contract-form";
import { ContractTable } from "./components/contract-table";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";

export default function NewWaterContractPage() {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/home" },
    { label: "Hợp đồng cấp nước mới" },
  ];

  return (
    <>
      <CustomBreadcrumb items={breadcrumbItems} />
      <div className="space-y-6 pt-2">
        <ContractForm />

        <div className="pt-4">
          <ContractTable />
        </div>
      </div>
    </>
  );
}
