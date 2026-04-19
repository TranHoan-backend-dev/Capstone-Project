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
import { CallToast } from "@/components/ui/CallToast";

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

  const handleEdit = async (item: SettlementItem) => {
    try {
      const res = await authFetch(`/api/construction/settlements/${item.id}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Không thể tải thông tin quyết toán");
      const json = await res.json();
      const settlementData = json?.data?.data ?? json?.data;
      const normalized =
        settlementData && typeof settlementData === "object"
          ? {
              ...settlementData,
              // đảm bảo luôn có `id` để PUT/DELETE dùng được
              id:
                (settlementData as any)?.id ??
                (settlementData as any)?.generalInformation?.settlementId ??
                item.id,
            }
          : item;
      setEditingItem(normalized);
      setShowAddForm(true);
    } catch (e: any) {
      CallToast({
        title: "Lỗi",
        message: e?.message || "Không thể tải thông tin quyết toán",
        color: "danger",
      });
      // fallback: vẫn mở modal với data hiện có
      setEditingItem(item);
      setShowAddForm(true);
    }
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleSuccess = () => {
    handleReload();
    handleCloseForm();
  };

  const getErrorMessage = (errorData: any, fallback: string) => {
    const fieldErrors = errorData?.error?.data ?? errorData?.data;
    if (fieldErrors && typeof fieldErrors === "object") {
      const details = Object.values(fieldErrors)
        .filter((value) => typeof value === "string" && value.trim() !== "")
        .join("; ");
      if (details) return details;
    }

    return errorData?.message || errorData?.error?.message || fallback;
  };
  
  const handleCreate = async (payload: any) => {
    try {
      const res = await authFetch("/api/construction/settlements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = getErrorMessage(errorData, "Tạo thất bại");
        throw new Error(errorMessage);
      }
      CallToast({
        title: "Thanh công",
        message: "Tạo quyết toán thành công",
        color: "success",
      });
      handleSuccess();
    } catch (error: any) {
      CallToast({
        title: "Lỗi",
        message: error.message || "Tạo quyết toán thất bại",
        color: "danger",
      });
      throw error;
    }
  };

  const handleUpdate = async (payload: any) => {
    const settlementId =
      (editingItem as any)?.id ??
      (editingItem as any)?.generalInformation?.settlementId;
    if (!settlementId) {
      CallToast({
        title: "Lỗi",
        message: "Không tìm thấy mã quyết toán để cập nhật",
        color: "danger",
      });
      return;
    }

    try {
      const res = await authFetch(
        `/api/construction/settlements/${settlementId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = getErrorMessage(errorData, "Cập nhật thất bại");
        throw new Error(errorMessage);
      }
      CallToast({
        title: "Thanh công",
        message: "Cập nhật quyết toán thành công",
        color: "success",
      });
      handleSuccess();
    } catch (error: any) {
      CallToast({
        title: "Lỗi",
        message: error.message || "Cập nhật quyết toán thất bại",
        color: "danger",
      });
      throw error;
    }
  };

  if (!profile) {
    return <p>Không thể tải danh sách quyết toán</p>;
  }

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
