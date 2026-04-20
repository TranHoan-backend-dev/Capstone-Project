"use client";

import React, { useState } from "react";
import { FilterSection } from "@/components/ui/FilterSection";
import { ResultsTable } from "./components/results-table";
import { Button, DateValue, Spinner } from "@heroui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { SettlementFilterRequest, SettlementItem } from "@/types";
import { useIsITStaff } from "@/hooks/useHasRole";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import { formatDate2 } from "@/utils/format";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useLogin";

const SettlementLookupPage = () => {
  const { profile } = useProfile();
  const { isITStaff, loading: roleLoading } = useIsITStaff();
  const [keyword, setKeyword] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [from, setFrom] = useState<DateValue | null | undefined>(null);
  const [to, setTo] = useState<DateValue | null | undefined>(null);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywordSearch, setKeywordSearch] = useState("");
  
  const router = useRouter();

  const handleSearch = () => {
    setKeywordSearch(keywordInput);
  };

  const handleReload = () => setReloadKey((prev) => prev + 1);
  
  const handleAddNew = () => {
    router.push("/settlement/run/new");
  };

  const handleEdit = (item: SettlementItem) => {
    const settlementId = item.id || item.settlementId;
    if (settlementId) {
      router.push(`/settlement/run/${settlementId}`);
    }
  };

  if (!profile) {
    return <p>Không thể tải danh sách quyết toán</p>;
  }

  const canCreateSettlement = profile?.role === "construction_department_staff";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Quản lý quyết toán công trình
        </h1>
        {canCreateSettlement && (
          <Button
            color="primary"
            startContent={<PlusIcon className="w-5 h-5" />}
            onPress={handleAddNew}
          >
            Tạo quyết toán mới
          </Button>
        )}
      </div>
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
      <ResultsTable
        keyword={keywordSearch}
        reloadKey={reloadKey}
        from={formatDate2(from)}
        to={formatDate2(to)}
        onEdit={handleEdit}
        onDeleted={handleReload}
      />
    </div>
  );
};

export default SettlementLookupPage;
