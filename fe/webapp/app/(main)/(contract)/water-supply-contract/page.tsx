import { Metadata } from "next";

import { ContractForm } from "./components/contract-form";
import { ContractTable } from "./components/contract-table";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";

export const metadata: Metadata = {
  title: "Hợp đồng cấp nước mới",
  description: "Hợp đồng cấp nước mới",
};

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
