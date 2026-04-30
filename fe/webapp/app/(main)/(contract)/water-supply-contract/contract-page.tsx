"use client";

import { useState } from "react";

import { ContractForm } from "./components/contract-form";
import { ContractTable } from "./components/contract-table";
import { useProfile } from "@/hooks/useLogin";

export default function NewWaterContractPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { profile, loading: profileLoading, hasRole } = useProfile();
  const isITStaff = hasRole("it_staff");
  const isCompanyLeader = hasRole("company_leadership");
  const isPlanningTechnicalHead = hasRole("planning_technical_department_head");
  const isOrderReceivingStaff = hasRole("order_receiving_staff");
  const isSurveyStaff = hasRole("survey_staff");
  const isConstructionHead = hasRole("construction_department_head");
  const isConstructionStaff = hasRole("construction_department_staff");
  const isFinanceStaff = hasRole("finance_department");
  const canView = isITStaff || isOrderReceivingStaff;
  const handleContractSuccess = () => {
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
