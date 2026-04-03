"use client";

import React, { useState } from "react";
import { useProfile } from "@/hooks/useLogin";
import { Spinner } from "@heroui/react";

import { ConstructionProcessor } from "./components/construction-processor";
import { PendingTable } from "./components/pending-table";
import { ApprovedTable } from "./components/approval-table";
import { FilterPendingConstructionRequest } from "@/types";

export default function PendingConstructionPage() {
  const { profile, loading: profileLoading, hasRole } = useProfile();
  const [filters, setFilters] = useState<FilterPendingConstructionRequest>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const isConstructionHead = hasRole("construction_department_head");
  const isConstructionStaff = hasRole("construction_department_staff");
  const isSurveyStaff = hasRole("survey_staff");
  const isITStaff = hasRole("it_staff");
  const canView =
    isConstructionHead || isConstructionStaff || isSurveyStaff || isITStaff;

  const handleFilterChange = (newFilters: FilterPendingConstructionRequest) => {
    setFilters(newFilters);
  };

  const handleApprove = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleReject = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!canView) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-600">
            Bạn không có quyền xem trang này. Vui lòng liên hệ quản trị viên.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ConstructionProcessor onFilterChange={handleFilterChange} />
      {(isConstructionHead || isConstructionStaff || isITStaff) && (
        <PendingTable
          filters={filters}
          onSuccess={handleApprove}
          refreshTrigger={refreshTrigger}
        />
      )}
      {isSurveyStaff || isITStaff ? <ApprovedTable refreshTrigger={refreshTrigger} /> : null}
    </div>
  );
}
