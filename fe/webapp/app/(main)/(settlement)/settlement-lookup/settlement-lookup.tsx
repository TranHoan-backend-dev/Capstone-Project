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
import { SettlementFormModal } from "./components/settlement-form-modal";
import { authFetch } from "@/utils/authFetch";
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

  const handleSearch = () => {
    setKeywordSearch(keywordInput);
  };
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<SettlementItem | null>(null);

  const handleReload = () => setReloadKey((prev) => prev + 1);
  const handleAddNew = () => {
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEdit = (item: SettlementItem) => {
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleSuccess = () => {
    handleReload();
    handleCloseForm();
  };
  
  const handleCreate = async (payload: any) => {
    const res = await authFetch("/api/construction/settlements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Tạo thất bại");

    handleSuccess();
  };

  const handleUpdate = async (payload: any) => {
    if (!editingItem?.id) return;

    const res = await authFetch(
      `/api/construction/settlements/${editingItem.id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) throw new Error("Cập nhật thất bại");

    handleSuccess();
  };

  // if (!isITStaff) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold text-danger mb-4">
  //           Truy cập bị từ chối
  //         </h1>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Quản lý quyết toán công trình
        </h1>
        <Button
          color="primary"
          startContent={<PlusIcon className="w-5 h-5" />}
          onPress={handleAddNew}
        >
          Tạo quyết toán mới
        </Button>
      </div>
      <SettlementFormModal
        isOpen={showAddForm}
        onClose={handleCloseForm}
        mode={editingItem ? "update" : "create"}
        initialData={editingItem}
        onSubmit={editingItem ? handleUpdate : handleCreate}
      />
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
