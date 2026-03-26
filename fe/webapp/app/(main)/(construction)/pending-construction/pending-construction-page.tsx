// pending-construction-page.tsx
"use client";

import React, { useState } from "react";

import { ConstructionProcessor } from "./components/construction-processor";
import { PendingTable } from "./components/pending-table";
import { ApprovedTable } from "./components/approval-table";
import { FilterPendingConstructionRequest } from "@/types";

export default function PendingConstructionPage() {
  const [filters, setFilters] = useState<FilterPendingConstructionRequest>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFilterChange = (newFilters: FilterPendingConstructionRequest) => {
    setFilters(newFilters);
  };

  const handleApprove = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleReject = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <ConstructionProcessor onFilterChange={handleFilterChange} />
      <PendingTable
        filters={filters}
        onApprove={handleApprove}
        onReject={handleReject}
        refreshTrigger={refreshTrigger}
      />
      <ApprovedTable refreshTrigger={refreshTrigger} />
    </>
  );
}
