"use client";

import React, { useState } from "react";
import { DateValue } from "@heroui/react";

import { FormActions } from "./components/form-actions";
import { OrderInfoSection } from "./components/(order-info)/order-info-section";
import { CustomerInfoSection } from "./components/(customer-info)/customer-info-section";
import { AddressContactSection } from "./components/(address-contact)/address-contact-section";
import { RelatedOrdersTable } from "./components/related-orders-table";
import { InvoiceInfoSection } from "./components/invoice-info-section";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { AddNewIcon } from "@/config/chip-and-icon";
import { FilterSection } from "@/components/ui/FilterSection";
import { formatDate2 } from "@/utils/format";
import { useProfile } from "@/hooks/useLogin";

const NewInstallationLookup = () => {
  const [keyword, setKeyword] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [from, setFrom] = useState<DateValue | null | undefined>(null);
  const [to, setTo] = useState<DateValue | null | undefined>(null);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywordSearch, setKeywordSearch] = useState("");
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
  const handleSearch = () => {
    setKeywordSearch(keywordInput);
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
      <FilterSection
        from={from}
        keyword={keywordInput}
        setFromAction={setFrom}
        setKeywordAction={setKeywordInput}
        setToAction={setTo}
        title="Tra cứu đơn"
        to={to}
        onSearch={handleSearch}
      />
      <RelatedOrdersTable
        keyword={keywordSearch}
        reloadKey={reloadKey}
        from={formatDate2(from)}
        to={formatDate2(to)}
      />
    </>
  );
};

export default NewInstallationLookup;
