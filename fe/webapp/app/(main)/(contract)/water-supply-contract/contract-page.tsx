"use client";

import { useState } from "react";

import { ContractForm } from "./components/contract-form";
import { ContractTable } from "./components/contract-table";

export default function NewWaterContractPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleContractSuccess = () => {
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
