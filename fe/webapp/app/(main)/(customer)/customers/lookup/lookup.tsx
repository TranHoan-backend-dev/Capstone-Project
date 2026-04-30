"use client";

import React, { useState } from "react";

import { FilterSection } from "./components/filter-section";
import { ResultsTable } from "./components/results-table";
import { CustomerFilter, CustomerLookupItem } from "@/types";
import { useProfile } from "@/hooks/useLogin";

const CustomersLookup = () => {
  const branches = [{ label: "Tất cả", value: "all" }];
  const areas = [{ label: "Tất cả", value: "all" }];
  const wards = [{ label: "Tất cả", value: "all" }];
  const neighborhoods = [{ label: "Tất cả", value: "all" }];
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
  const [keyword, setKeyword] = useState<CustomerFilter>({
    name: "",
    phoneNumber: "",
    formNumber: "",
    roadmapId: "",
  });

  const [reloadKey, setReloadKey] = useState(0);

  const handleSearch = (filters: CustomerFilter) => {
    setKeyword(filters);
    setReloadKey((prev) => prev + 1);
  };

  const handleReload = () => setReloadKey((prev) => prev + 1);

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
      <FilterSection onSearch={handleSearch} />

      <ResultsTable
        keyword={keyword}
        reloadKey={reloadKey}
        onDeleted={handleReload}
      />
    </>
  );
};

export default CustomersLookup;
