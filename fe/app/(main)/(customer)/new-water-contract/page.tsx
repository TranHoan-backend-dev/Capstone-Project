"use client";
import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { ContractForm } from "./components/contract-form";
import { ContractTable } from "./components/contract-table";

export default function NewWaterContractPage() {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/home" },
    { label: "Hợp đồng cấp nước mới" },
  ];

  return (
    <>
      <CustomBreadcrumb items={breadcrumbItems} />
      <div className="space-y-6 pt-2">
        {/* Khối Form */}
        <ContractForm />

        {/* Khối Table */}
        <div className="pt-4">
          <ContractTable />
        </div>
      </div>
    </>
  );
}