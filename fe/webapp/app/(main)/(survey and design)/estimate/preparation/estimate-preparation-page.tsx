"use client";

import React, { useState } from "react";
import { DateValue } from "@heroui/react";

import { ResultsTable } from "./components/results-table";

import { FilterSection } from "@/components/ui/FilterSection";
import { formatDate } from "@/utils/format";
import { useProfile } from "@/hooks/useLogin";

const EstimatePreparationPage = () => {
  const [keyword, setKeyword] = useState("");
  const [from, setFrom] = useState<DateValue | null | undefined>(null);
  const [to, setTo] = useState<DateValue | null | undefined>(null);
  const { profile, loading: profileLoading, hasRole } = useProfile();
  const isITStaff = hasRole("it_staff");
  const isCompanyLeader = hasRole("company_leadership");
  const isPlanningTechnicalHead = hasRole("planning_technical_department_head");
  const isOrderReceivingStaff = hasRole("order_receiving_staff");
  const isSurveyStaff = hasRole("survey_staff");
  const isConstructionHead = hasRole("construction_department_head");
  const isConstructionStaff = hasRole("construction_department_staff");
  const isFinanceStaff = hasRole("finance_department");
  const canView =
    isITStaff || isSurveyStaff || isCompanyLeader || isPlanningTechnicalHead;

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
      <FilterSection
        actions={<></>}
        from={from}
        keyword={keyword}
        setFromAction={setFrom}
        setKeywordAction={setKeyword}
        setToAction={setTo}
        title="Bộ lọc"
        to={to}
      />
      <ResultsTable
        keyword={keyword}
        from={formatDate(from)}
        to={formatDate(to)}
      />
    </>
  );
};

export default EstimatePreparationPage;
