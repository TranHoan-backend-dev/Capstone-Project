// app/contracts/page.tsx
"use client"; // Thêm "use client" vì có state

import { useState } from "react";

import { ContractForm } from "./components/contract-form";
import { ContractTable } from "./components/contract-table";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";

export default function NewWaterContractPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/home" },
    { label: "Hợp đồng cấp nước mới" },
  ];

  const handleContractSuccess = () => {
    // Trigger refresh của table
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <div className="space-y-6 pt-2">
        <ContractForm onSuccess={handleContractSuccess} />

        <div className="pt-4">
          <ContractTable
            refreshTrigger={refreshTrigger}
            onDeleteSuccess={handleContractSuccess}
          />
        </div>
      </div>
    </>
  );
}
